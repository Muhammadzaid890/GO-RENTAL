"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/actions/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateAgentProfile(formData: { name: string; phone: string }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "PLEASE LOGIN FIRST." };
    }

    // Phone uniqueness check
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: formData.phone,
        NOT: { id: session.id },
      },
    });

    if (existingPhone) {
      return { success: false, error: "THIS PHONE NUMBER IS ALREADY IN USE." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: formData.name.toUpperCase(),
        phone: formData.phone,
      },
    });

    // Session update
    const cookieStore = await cookies();
    cookieStore.set(
      "auth_session",
      JSON.stringify({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "FAILED TO UPDATE PROFILE." };
  }
}