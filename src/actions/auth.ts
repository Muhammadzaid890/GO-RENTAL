"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. REGISTER USER (Default: CLIENT with dynamic free credits)
export async function registerUser(formData: {
  name: string;
  email: string;
  phone: string;
  role?: string;
}) {
  try {
    const cleanEmail = formData.email.toLowerCase().trim();

    // 1. Check global platform settings from DB
    const settings = await prisma.systemSetting.findUnique({
      where: { id: "global_config" },
    });

    if (settings && settings.allowRegistration === false) {
      return {
        success: false,
        error: "NEW REGISTRATIONS ARE TEMPORARILY DISABLED BY ADMIN.",
      };
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return { success: false, error: "USER ALREADY EXISTS WITH THIS EMAIL." };
    }

    // Role mapping: Prisma enum strictly CLIENT, AGENT, ADMIN
    let assignedRole: "CLIENT" | "AGENT" | "ADMIN" = "CLIENT";
    const requestedRole = (formData.role || "").toUpperCase();

    if (requestedRole === "AGENT") {
      assignedRole = "AGENT";
    } else if (requestedRole === "ADMIN") {
      assignedRole = "ADMIN";
    } else {
      // "USER" ya default form submission hamesha CLIENT banega
      assignedRole = "CLIENT";
    }

    // Free Ad Credits: Admin setting se, warna default 3
    const freeCredits = settings?.defaultFreeCredits ?? 3;

    // Create user with CLIENT role
    const newUser = await prisma.user.create({
      data: {
        name: formData.name.trim().toUpperCase(),
        email: cleanEmail,
        phone: formData.phone.trim(),
        role: assignedRole,
        wallet: {
          create: {
            adCredits: freeCredits,
            boostCredits: 0,
          },
        },
      },
      include: {
        wallet: true,
      },
    });

    // Set auth session cookie
    const cookieStore = await cookies();
    cookieStore.set(
      "auth_session",
      JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      }
    );

    revalidatePath("/");
    revalidatePath("/dashboard/wallet");
    revalidatePath("/dashboard/my-ads");

    return {
      success: true,
      user: newUser,
      message: `ACCOUNT CREATED WITH ${freeCredits} FREE AD CREDITS!`,
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error?.message || "FAILED TO REGISTER USER." };
  }
}

// 2. Client Signup Helper
export async function signupClient(formData: {
  name: string;
  email: string;
  phone: string;
}) {
  return registerUser({ ...formData, role: "CLIENT" });
}

// 3. Login (Email Check)
export async function loginUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { wallet: true },
    });

    if (!user) {
      return { success: false, error: "NO ACCOUNT FOUND WITH THIS EMAIL." };
    }

    if (user.isBanned) {
      return {
        success: false,
        error: "YOUR ACCOUNT HAS BEEN SUSPENDED. CONTACT ADMIN.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(
      "auth_session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    revalidatePath("/");
    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "FAILED TO LOG IN." };
  }
}

// 4. Logout (Clear Cookie)
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("auth_session", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
    cookieStore.delete("auth_session");

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "FAILED TO LOGOUT." };
  }
}

// 5. Logout Action (With Redirect)
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("auth_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  cookieStore.delete("auth_session");
  revalidatePath("/");
  redirect("/login");
}

// 6. Get Current Active Session
export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session");

  if (!session?.value) return null;

  try {
    return JSON.parse(session.value) as {
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "AGENT" | "CLIENT";
    };
  } catch {
    return null;
  }
}

// 7. Admin Power: Promote Client to Agent
export async function upgradeClientToAgent(targetUserId: string) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: ONLY ADMINS CAN PROMOTE TO AGENT." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: "AGENT" },
    });

    revalidatePath("/admin/users");
    return { success: true, message: `${updatedUser.name} IS NOW AN AGENT!` };
  } catch (error: any) {
    return { success: false, error: error?.message || "FAILED TO UPGRADE ROLE." };
  }
}