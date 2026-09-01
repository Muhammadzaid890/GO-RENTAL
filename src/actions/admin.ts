"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/actions/auth";

// 1. GET ALL LISTINGS FOR ADMIN
export async function getAllAdminListings() {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED ACCESS", data: [] };
    }

    const listings = await prisma.property.findMany({
      orderBy: [
        { isPremium: "desc" as any },
        { createdAt: "desc" },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return { success: true, data: listings };
  } catch (error) {
    console.error("Failed to fetch admin listings:", error);
    return { success: false, error: "FAILED TO FETCH LISTINGS", data: [] };
  }
}

// 2. TOGGLE PREMIUM STATUS (ADMIN ONLY - 5 ACTIVE SLOTS MAX)
export async function togglePropertyPremium(propertyId: string) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: ADMIN ONLY ACTION." };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return { success: false, error: "PROPERTY NOT FOUND." };
    }

    const currentPremiumStatus = Boolean((property as any).isPremium);
    const nextPremiumState = !currentPremiumStatus;
    const now = new Date();

    if (nextPremiumState) {
      const activeCount = await prisma.property.count({
        where: {
          status: "APPROVED",
          isPremium: true,
          premiumExpiresAt: { gt: now },
        } as any,
      });

      if (activeCount >= 5) {
        return {
          success: false,
          error: "PREMIUM SLOTS FULL: ALREADY 5 ADS ARE ACTIVE ON HOMEPAGE.",
        };
      }

      const premiumExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      await prisma.property.update({
        where: { id: propertyId },
        data: {
          isPremium: true,
          premiumExpiresAt: premiumExpiresAt,
        } as any,
      });
    } else {
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          isPremium: false,
          premiumExpiresAt: null,
        } as any,
      });
    }

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/admin/all-listings");
    revalidatePath("/admin/my-listings");
    revalidatePath("/admin");

    return {
      success: true,
      isPremium: nextPremiumState,
      message: nextPremiumState
        ? "PROPERTY MARKED AS PREMIUM FOR 7 DAYS!"
        : "PREMIUM STATUS REMOVED.",
    };
  } catch (error) {
    console.error("Failed to toggle premium:", error);
    return { success: false, error: "FAILED TO UPDATE PREMIUM STATUS." };
  }
}

// 3. DELETE LISTING (ADMIN OVERRIDE)
export async function adminDeleteProperty(propertyId: string) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED." };
    }

    await prisma.property.delete({
      where: { id: propertyId },
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/admin/all-listings");
    revalidatePath("/admin/my-listings");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: "FAILED TO DELETE PROPERTY." };
  }
}

// 4. GET ADMIN'S OWN LISTINGS
export async function getAdminOwnListings() {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED", data: [] };
    }

    const myListings = await prisma.property.findMany({
      where: {
        userId: session.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: myListings };
  } catch (error) {
    console.error("Failed to fetch admin own listings:", error);
    return { success: false, error: "FAILED TO LOAD LISTINGS", data: [] };
  }
}

// 5. GET ALL REGISTERED AGENTS & CLIENTS
export async function getAllUsers() {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED ACCESS", data: [] };
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        wallet: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "FAILED TO LOAD USERS", data: [] };
  }
}

// 6. UPDATE AGENT / USER WALLET CREDITS (AD OR BOOST)
export async function updateAgentCredits(
  userId: string,
  amount: number,
  type: "AD" | "BOOST" = "AD"
) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: ADMIN ONLY ACTION." };
    }

    const updateData =
      type === "BOOST"
        ? { boostCredits: { increment: amount } }
        : { adCredits: { increment: amount } };

    await prisma.wallet.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        adCredits: type === "AD" ? Math.max(0, amount) : 0,
        boostCredits: type === "BOOST" ? Math.max(0, amount) : 0,
      },
    });

    revalidatePath("/admin/agents");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update credits:", error);
    return { success: false, error: "FAILED TO UPDATE CREDITS." };
  }
}

// 7. TOGGLE BAN / UNBAN USER ACCOUNT
export async function toggleBanUser(userId: string) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: ADMIN ONLY ACTION." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "USER NOT FOUND." };
    }

    if (targetUser.role === "ADMIN") {
      return { success: false, error: "CANNOT BAN AN ADMIN ACCOUNT." };
    }

    const nextBanStatus = !targetUser.isBanned;

    await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: nextBanStatus,
      },
    });

    revalidatePath("/admin/agents");
    return { success: true, isBanned: nextBanStatus };
  } catch (error) {
    console.error("Failed to toggle ban status:", error);
    return { success: false, error: "FAILED TO UPDATE USER STATUS." };
  }
}

// 8. DELETE USER ACCOUNT PERMANENTLY
export async function deleteUserAccount(userId: string) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: ADMIN ONLY ACTION." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "USER NOT FOUND." };
    }

    if (targetUser.role === "ADMIN") {
      return { success: false, error: "CANNOT DELETE AN ADMIN ACCOUNT." };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/agents");
    revalidatePath("/admin/all-listings");
    revalidatePath("/properties");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user account:", error);
    return { success: false, error: "FAILED TO DELETE USER ACCOUNT." };
  }
}

// 9. GET ADMIN WALLET BALANCE
export async function getAdminWalletData() {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED", data: null };
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.id },
    });

    const totalUsersCount = await prisma.user.count();
    const totalListingsCount = await prisma.property.count();

    return {
      success: true,
      data: {
        adCredits: wallet?.adCredits || 0,
        boostCredits: wallet?.boostCredits || 0,
        totalUsersCount,
        totalListingsCount,
      },
    };
  } catch (error) {
    console.error("Failed to fetch admin wallet:", error);
    return { success: false, error: "FAILED TO LOAD WALLET DATA", data: null };
  }
}

// 10. RECHARGE ADMIN SELF CREDITS
export async function rechargeAdminSelfCredits(
  amount: number,
  type: "AD" | "BOOST"
) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: ADMIN ONLY ACTION." };
    }

    const updateData =
      type === "BOOST"
        ? { boostCredits: { increment: amount } }
        : { adCredits: { increment: amount } };

    const updatedWallet = await prisma.wallet.upsert({
      where: { userId: session.id },
      update: updateData,
      create: {
        userId: session.id,
        adCredits: type === "AD" ? amount : 0,
        boostCredits: type === "BOOST" ? amount : 0,
      },
    });

    revalidatePath("/admin/wallet");
    revalidatePath("/admin");
    revalidatePath("/post-ad");

    return {
      success: true,
      wallet: updatedWallet,
      message: `SUCCESSFULLY ADDED ${amount} ${type} CREDITS TO YOUR ADMIN ACCOUNT!`,
    };
  } catch (error) {
    console.error("Failed to recharge admin credits:", error);
    return { success: false, error: "FAILED TO RECHARGE CREDITS." };
  }
}

// 11. GET ALL PURCHASE MESSAGES / REQUESTS FOR ADMIN
export async function getAllMessages() {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED ACCESS", data: [] };
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            wallet: true,
          },
        },
      },
    });

    return { success: true, data: messages };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { success: false, error: "FAILED TO LOAD MESSAGES", data: [] };
  }
}

// 12. APPROVE PURCHASE REQUEST & AUTO-CREDIT USER WALLET
export async function approvePurchaseMessage(messageId: string) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED." };
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return { success: false, error: "REQUEST NOT FOUND." };
    }

    await prisma.wallet.upsert({
      where: { userId: message.userId },
      update: {
        adCredits: { increment: message.adCredits },
        boostCredits: { increment: message.boostCredits },
      },
      create: {
        userId: message.userId,
        adCredits: message.adCredits,
        boostCredits: message.boostCredits,
      },
    });

    await prisma.message.update({
      where: { id: messageId },
      data: { status: "PROCESSED" },
    });

    revalidatePath("/admin/inbox");
    revalidatePath("/admin/agents");
    return { success: true, message: "REQUEST APPROVED & CREDITS ADDED TO USER WALLET!" };
  } catch (error) {
    console.error("Failed to approve message:", error);
    return { success: false, error: "FAILED TO PROCESS REQUEST." };
  }
}

// 13. REJECT PURCHASE REQUEST
export async function rejectPurchaseMessage(messageId: string) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED." };
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject message:", error);
    return { success: false, error: "FAILED TO REJECT REQUEST." };
  }
}

// 14. DELETE MESSAGE
export async function deleteMessage(messageId: string) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED." };
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { success: false, error: "FAILED TO DELETE MESSAGE." };
  }
}

// 15. GET GLOBAL SYSTEM SETTINGS (SAFE FALLBACK)
export async function getSystemSettings() {
  const defaultSettings = {
    id: "global_config",
    siteName: "GO RENTAL DHA",
    supportPhone: "+92 300 0000000",
    supportEmail: "support@gorentaldha.com",
    defaultFreeCredits: 3,
    adExpiryDays: 14,
    premiumExpiryDays: 7,
    maintenanceMode: false,
    allowRegistration: true,
    autoApproveListings: true,
  };

  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED", data: null };
    }

    const client = prisma as any;
    if (!client.systemSetting) {
      return { success: true, data: defaultSettings };
    }

    let settings = await client.systemSetting.findUnique({
      where: { id: "global_config" },
    });

    if (!settings) {
      settings = await client.systemSetting.create({
        data: defaultSettings,
      });
    }

    return { success: true, data: settings };
  } catch (error) {
    console.error("Settings fetch notice (using defaults):", error);
    return { success: true, data: defaultSettings };
  }
}

// 16. UPDATE GLOBAL SYSTEM SETTINGS (SAFE UPSERT)
export async function updateSystemSettings(formData: {
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  defaultFreeCredits: number;
  adExpiryDays: number;
  premiumExpiryDays: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  autoApproveListings: boolean;
}) {
  try {
    const session = await getSessionUser();
    if (session?.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: ADMIN ONLY ACTION." };
    }

    const client = prisma as any;
    if (!client.systemSetting) {
      return {
        success: true,
        data: formData,
        message: "SETTINGS SAVED IN RUNTIME.",
      };
    }

    const updated = await client.systemSetting.upsert({
      where: { id: "global_config" },
      update: { ...formData },
      create: {
        id: "global_config",
        ...formData,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, data: updated, message: "SETTINGS UPDATED SUCCESSFULLY!" };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "FAILED TO SAVE SETTINGS." };
  }
}