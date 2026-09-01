"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/actions/auth";
import { revalidatePath } from "next/cache";

export async function sendBundleInquiry(bundle: {
  name: string;
  price: string;
  adCredits: number;
  boostCredits: number;
}) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "PLEASE LOGIN TO SEND INQUIRY." };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return { success: false, error: "USER NOT FOUND." };
    }

    if (user.isBanned) {
      return { success: false, error: "BANNED ACCOUNTS CANNOT SEND INQUIRIES." };
    }

    await prisma.message.create({
      data: {
        bundleName: bundle.name,
        bundlePrice: bundle.price,
        adCredits: bundle.adCredits,
        boostCredits: bundle.boostCredits,
        userId: user.id,
      },
    });

    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Failed to send bundle inquiry:", error);
    return { success: false, error: "FAILED TO SEND MESSAGE TO ADMIN." };
  }
}

export async function deleteMessage(messageId: string) {
  try {
    await prisma.message.delete({
      where: { id: messageId },
    });
    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    return { success: false, error: "FAILED TO DELETE MESSAGE." };
  }
}