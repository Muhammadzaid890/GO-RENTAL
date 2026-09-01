"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/actions/auth";

export interface PropertyFilterParams {
  phase?: string;
  type?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  page?: string;
}

// 1. GET FILTERED PROPERTIES WITH PAGINATION
export async function getFilteredProperties(params: PropertyFilterParams) {
  try {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = 20;

    const whereClause: any = {
      status: "APPROVED",
    };

    if (params.phase && params.phase !== "ALL PHASES" && params.phase !== "ALL") {
      whereClause.phase = {
        contains: params.phase,
        mode: "insensitive",
      };
    }

    if (params.type && params.type !== "HOMES" && params.type !== "ALL TYPES") {
      whereClause.propertyType = {
        contains: params.type,
        mode: "insensitive",
      };
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { phase: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params.minPrice || params.maxPrice) {
      whereClause.rentPrice = {};
      if (params.minPrice) {
        whereClause.rentPrice.gte = Number(params.minPrice);
      }
      if (params.maxPrice) {
        whereClause.rentPrice.lte = Number(params.maxPrice);
      }
    }

    if (params.minArea || params.maxArea) {
      whereClause.areaSqYards = {};
      if (params.minArea) {
        whereClause.areaSqYards.gte = Number(params.minArea);
      }
      if (params.maxArea) {
        whereClause.areaSqYards.lte = Number(params.maxArea);
      }
    }

    const totalCount = await prisma.property.count({ where: whereClause });

    const properties = await prisma.property.findMany({
      where: whereClause,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: [
        { isPremium: "desc" },
        { isBoosted: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return {
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch filtered properties:", error);
    return {
      properties: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }
}

// 2. GET ACTIVE PREMIUM PROPERTIES (MAX 5 ADS FOR HOMEPAGE)
export async function getPremiumProperties() {
  try {
    const now = new Date();
    const premiumAds = await prisma.property.findMany({
      where: {
        status: "APPROVED",
        isPremium: true,
        premiumExpiresAt: {
          gt: now,
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return premiumAds;
  } catch (error) {
    console.error("Failed to fetch premium properties:", error);
    return [];
  }
}

// 3. CREATE RENTAL AD
export async function createRentalAd(formData: {
  title: string;
  description: string;
  rentPrice: number;
  phase: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqYards: number;
  images: string[];
  userEmail?: string;
  isPremium?: boolean;
}) {
  try {
    const session = await getSessionUser();
    const targetEmail = session?.email || formData.userEmail;

    if (!targetEmail) {
      return { success: false, error: "PLEASE LOGIN TO POST AN AD." };
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail.toLowerCase() },
      include: { wallet: true },
    });

    if (!user) {
      return { success: false, error: "USER NOT FOUND." };
    }

    if (user.isBanned) {
      return {
        success: false,
        error: "YOUR ACCOUNT HAS BEEN SUSPENDED. YOU CANNOT POST ADS.",
      };
    }

    const isAdmin = user.role === "ADMIN";
    const requestedPremium = Boolean(formData.isPremium && isAdmin);

    if (formData.isPremium && !isAdmin) {
      return {
        success: false,
        error: "UNAUTHORIZED: ONLY ADMINS CAN POST PREMIUM PROPERTIES.",
      };
    }

    const now = new Date();
    let premiumExpiresAt: Date | null = null;

    if (requestedPremium) {
      const activeCount = await prisma.property.count({
        where: {
          status: "APPROVED",
          isPremium: true,
          premiumExpiresAt: { gt: now },
        },
      });

      if (activeCount >= 5) {
        return {
          success: false,
          error: "PREMIUM SLOTS FULL: MAXIMUM 5 ACTIVE PREMIUM ADS ALLOWED AT A TIME.",
        };
      }

      premiumExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    if (!isAdmin && (!user.wallet || user.wallet.adCredits < 1)) {
      return {
        success: false,
        error: "INSUFFICIENT AD CREDITS. PLEASE RECHARGE YOUR WALLET.",
      };
    }

    const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.property.create({
        data: {
          title: formData.title.toUpperCase(),
          description: formData.description,
          rentPrice: formData.rentPrice,
          phase: formData.phase,
          propertyType: formData.propertyType,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          areaSqYards: formData.areaSqYards,
          images: formData.images.slice(0, 5),
          userId: user.id,
          status: "APPROVED",
          isPremium: requestedPremium,
          premiumExpiresAt: premiumExpiresAt,
          expiresAt: expiresAt,
        },
      });

      if (!isAdmin && user.wallet) {
        await tx.wallet.update({
          where: { userId: user.id },
          data: {
            adCredits: {
              decrement: 1,
            },
          },
        });
      }
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/dashboard/my-ads");
    return { success: true };
  } catch (error) {
    console.error("Failed to post ad:", error);
    return { success: false, error: "FAILED TO POST AD. PLEASE TRY AGAIN." };
  }
}

// 4. DELETE AGENT PROPERTY (EXPORT RESTORED)
export async function deleteAgentProperty(propertyId: string) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "PLEASE LOGIN FIRST." };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return { success: false, error: "PROPERTY NOT FOUND." };
    }

    if (property.userId !== session.id && session.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED ACTION." };
    }

    // 14-day lock check (admins can override)
    const now = new Date();
    if (session.role !== "ADMIN" && property.expiresAt && property.expiresAt > now) {
      return {
        success: false,
        error: "THIS AD IS CURRENTLY ACTIVE AND LOCKED FOR 14 DAYS.",
      };
    }

    await prisma.property.delete({
      where: { id: propertyId },
    });

    revalidatePath("/dashboard/my-ads");
    revalidatePath("/properties");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: "FAILED TO DELETE PROPERTY." };
  }
}