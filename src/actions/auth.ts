"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Client Signup (Default Role: CLIENT, 3 Ad Credits, 0 Boost)
export async function signupClient(formData: {
  name: string;
  email: string;
  phone: string;
}) {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: formData.email.toLowerCase() },
    });

    if (existing) {
      return { success: false, error: "AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS." };
    }

    const newUser = await prisma.user.create({
      data: {
        name: formData.name.toUpperCase(),
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        role: "CLIENT" as any,
        wallet: {
          create: {
            adCredits: 3,
            boostCredits: 0,
          },
        },
      },
    });

    // Set secure auth cookie
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
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "FAILED TO CREATE ACCOUNT. TRY AGAIN." };
  }
}

// 2. Login (Checks by Email)
export async function loginUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { wallet: true },
    });

    if (!user) {
      return { success: false, error: "NO ACCOUNT FOUND WITH THIS EMAIL." };
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

// 3. Logout Function (Guaranteed Cookie Clear)
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    
    // Cookie ko properly invalidate karein
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

// 4. Logout Action with Direct Redirect
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

// 5. Get Current Active Session
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