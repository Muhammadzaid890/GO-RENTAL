import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/actions/auth";

// 1. GET ALL PROPERTIES FOR LOGGED IN AGENT
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json([], { status: 401 });
    }

    const properties = await prisma.property.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error: any) {
    console.error("GET Agent Properties Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST / CREATE NEW RENTAL AD
export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "UNAUTHORIZED: PLEASE LOGIN FIRST." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      rentPrice,
      phase,
      propertyType,
      bedrooms,
      bathrooms,
      areaSqYards,
      images,
      contactNumber,
      whatsappNumber,
      isPremium,
    } = body;

    // Fetch user with wallet
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { wallet: true },
    });

    if (!user) {
      return NextResponse.json({ error: "USER NOT FOUND." }, { status: 404 });
    }

    if (user.isBanned) {
      return NextResponse.json(
        { error: "ACCOUNT SUSPENDED. YOU CANNOT POST ADS." },
        { status: 403 }
      );
    }

    const isAdmin = user.role === "ADMIN";
    const requestedPremium = Boolean(isPremium && isAdmin);

    // Credit check for regular users
    if (!isAdmin && (!user.wallet || user.wallet.adCredits < 1)) {
      return NextResponse.json(
        { error: "INSUFFICIENT AD CREDITS. PLEASE RECHARGE YOUR WALLET." },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
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
        return NextResponse.json(
          { error: "PREMIUM SLOTS FULL (MAX 5 ALLOWED)." },
          { status: 400 }
        );
      }
      premiumExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    // Transaction to create property and decrement credit
    const property = await prisma.$transaction(async (tx) => {
      const newProp = await tx.property.create({
        data: {
          title: String(title).toUpperCase(),
          description: description || "",
          rentPrice: Number(rentPrice) || 0,
          phase: String(phase),
          propertyType: String(propertyType),
          bedrooms: bedrooms ? Number(bedrooms) : null,
          bathrooms: bathrooms ? Number(bathrooms) : null,
          areaSqYards: Number(areaSqYards) || 0,
          images: Array.isArray(images) ? images.slice(0, 5) : [],
          contactNumber: contactNumber || user.phone || "",
          whatsappNumber: whatsappNumber || null,
          userId: user.id,
          status: "APPROVED",
          isPremium: requestedPremium,
          premiumExpiresAt,
          expiresAt,
        },
      });

      if (!isAdmin && user.wallet) {
        await tx.wallet.update({
          where: { userId: user.id },
          data: {
            adCredits: { decrement: 1 },
          },
        });
      }

      return newProp;
    });

    return NextResponse.json({ success: true, property });
  } catch (error: any) {
    console.error("POST Agent Property Error:", error);
    return NextResponse.json(
      { error: error.message || "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
}