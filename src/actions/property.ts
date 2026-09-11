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

// Helper: Smart Type Mapping (Bungalow, Portion, Apartment, Commercial harmonization)
function getTargetPropertyTypes(rawType: string): string[] | null {
  const upper = rawType.trim().toUpperCase();

  if (upper === "HOMES" || upper === "ALL TYPES" || upper === "ALL" || !upper) {
    return null;
  }

  if (upper.includes("APARTMENT") || upper.includes("FLAT")) {
    return ["APARTMENT", "FLAT", "CONDOS", "PENTHOUSE"];
  }

  if (upper.includes("PORTION")) {
    return ["PORTION", "UPPER PORTION", "LOWER PORTION"];
  }

  if (upper.includes("HOUSE") || upper.includes("BUNGALOW")) {
    return ["HOUSE", "BUNGALOW", "FARM HOUSE"];
  }

  if (upper.includes("COMMERCIAL") || upper.includes("OFFICE") || upper.includes("SHOP")) {
    return ["COMMERCIAL", "OFFICE", "SHOP", "BUILDING", "SHOWROOM"];
  }

  return [upper];
}

// Helper: Phase variations generator (Roman numbers & standard names)
function getPhaseVariations(rawPhase: string): string[] {
  const p = rawPhase.trim().toUpperCase();
  const variations = [p];

  if (p.includes("8")) variations.push("PHASE 8", "PHASE VIII", "DHA 8", "DHA PHASE 8");
  if (p.includes("6")) variations.push("PHASE 6", "PHASE VI", "DHA 6", "DHA PHASE 6");
  if (p.includes("7")) variations.push("PHASE 7", "PHASE VII", "DHA 7", "DHA PHASE 7");
  if (p.includes("5")) variations.push("PHASE 5", "PHASE V", "DHA 5", "DHA PHASE 5");
  if (p.includes("4")) variations.push("PHASE 4", "PHASE IV", "DHA 4", "DHA PHASE 4");
  if (p.includes("2")) variations.push("PHASE 2", "PHASE II", "DHA 2", "DHA PHASE 2", "PHASE 2 EXT", "EXTENSION");

  return Array.from(new Set(variations));
}

// 1. GET FILTERED PROPERTIES WITH SMART MATCHING & PRIORITY RANKING
export async function getFilteredProperties(params: PropertyFilterParams) {
  try {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = 20;

    const andConditions: any[] = [{ status: "APPROVED" }];

    // 1. Phase Filter with Variations
    if (params.phase && params.phase !== "ALL PHASES" && params.phase !== "ALL") {
      const phaseList = getPhaseVariations(params.phase);
      andConditions.push({
        OR: phaseList.map((ph) => ({
          phase: { contains: ph, mode: "insensitive" },
        })),
      });
    }

    // 2. Property Type Filter
    if (params.type) {
      const mappedTypes = getTargetPropertyTypes(params.type);
      if (mappedTypes && mappedTypes.length > 0) {
        andConditions.push({
          OR: mappedTypes.map((t) => ({
            propertyType: { contains: t, mode: "insensitive" },
          })),
        });
      }
    }

    // 3. Keyword / Location Search Filter
    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      const qUpper = q.toUpperCase();
      const isApartmentSearch = qUpper.includes("APARTMENT") || qUpper.includes("FLAT");
      const isPortionSearch = qUpper.includes("PORTION");
      const isHouseSearch = qUpper.includes("BUNGALOW") || qUpper.includes("HOUSE");
      const isCommercialSearch = qUpper.includes("COMMERCIAL") || qUpper.includes("OFFICE") || qUpper.includes("SHOP");

      const textSearchConditions: any[] = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { phase: { contains: q, mode: "insensitive" } },
      ];

      if (isApartmentSearch) {
        textSearchConditions.push(
          { propertyType: { contains: "APARTMENT", mode: "insensitive" } },
          { propertyType: { contains: "FLAT", mode: "insensitive" } },
          { propertyType: { contains: "PENTHOUSE", mode: "insensitive" } }
        );
      } else if (isPortionSearch) {
        textSearchConditions.push(
          { propertyType: { contains: "PORTION", mode: "insensitive" } }
        );
      } else if (isHouseSearch) {
        textSearchConditions.push(
          { propertyType: { contains: "HOUSE", mode: "insensitive" } },
          { propertyType: { contains: "BUNGALOW", mode: "insensitive" } }
        );
      } else if (isCommercialSearch) {
        textSearchConditions.push(
          { propertyType: { contains: "COMMERCIAL", mode: "insensitive" } },
          { propertyType: { contains: "OFFICE", mode: "insensitive" } },
          { propertyType: { contains: "SHOP", mode: "insensitive" } }
        );
      } else {
        textSearchConditions.push({
          propertyType: { contains: q, mode: "insensitive" },
        });
      }

      andConditions.push({ OR: textSearchConditions });
    }

    // 4. Price Filters
    if (params.minPrice || params.maxPrice) {
      const priceCondition: any = {};
      if (params.minPrice) priceCondition.gte = Number(params.minPrice);
      if (params.maxPrice) priceCondition.lte = Number(params.maxPrice);
      andConditions.push({ rentPrice: priceCondition });
    }

    // 5. Area Filters
    if (params.minArea || params.maxArea) {
      const areaCondition: any = {};
      if (params.minArea) areaCondition.gte = Number(params.minArea);
      if (params.maxArea) areaCondition.lte = Number(params.maxArea);
      andConditions.push({ areaSqYards: areaCondition });
    }

    const whereClause: any = { AND: andConditions };

    const totalCount = await prisma.property.count({ where: whereClause });

    // PRIORITY SORTING: PREMIUM FIRST -> BOOSTED SECOND -> NEWEST THIRD
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

// 2. GET ACTIVE PREMIUM PROPERTIES (NO LIMIT - FETCH ALL ADMIN SET PREMIUM ADS)
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

// 3. CREATE RENTAL AD (UNLIMITED PREMIUM ADS FOR ADMIN)
export async function createRentalAd(formData: {
  title: string;
  description: string;
  rentPrice: number;
  phase: string;
  propertyType: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqYards: number;
  images: string[];
  contactNumber?: string;
  whatsappNumber?: string;
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
          bedrooms: formData.bedrooms ?? null,
          bathrooms: formData.bathrooms ?? null,
          areaSqYards: formData.areaSqYards,
          images: formData.images.slice(0, 5),
          contactNumber: formData.contactNumber || user.phone || "",
          whatsappNumber: formData.whatsappNumber || null,
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

// 4. DELETE AGENT PROPERTY
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

// 5. BOOST RENTAL AD
export async function boostRentalAd(propertyId: string, days: number | string = 7) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "PLEASE LOGIN FIRST TO BOOST AN AD." };
    }

    const numDays = typeof days === "string" ? parseInt(days, 10) || 7 : days;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + numDays);

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return { success: false, error: "PROPERTY NOT FOUND." };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: session.id || "" },
          { email: session.email?.toLowerCase() || "" },
        ],
      },
      include: { wallet: true },
    });

    if (!user) {
      return { success: false, error: "USER NOT FOUND." };
    }

    const isAdmin = user.role === "ADMIN";

    if (!isAdmin && (!user.wallet || user.wallet.boostCredits < 1)) {
      return {
        success: false,
        error: "INSUFFICIENT BOOST CREDITS. PLEASE RECHARGE FROM THE CREDIT SHOP.",
      };
    }

    const updated = await prisma.$transaction(async (tx) => {
      const prop = await tx.property.update({
        where: { id: propertyId },
        data: {
          isBoosted: true,
          boostExpiresAt: expiresAt,
        },
      });

      if (!isAdmin && user.wallet) {
        await tx.wallet.update({
          where: { userId: user.id },
          data: {
            boostCredits: {
              decrement: 1,
            },
          },
        });
      }

      return prop;
    });

    revalidatePath("/dashboard/my-ads");
    revalidatePath("/dashboard/wallet");
    revalidatePath("/properties");
    revalidatePath("/");

    return { success: true, property: updated };
  } catch (error: any) {
    console.error("Boost Rental Ad Error:", error);
    return { success: false, error: error.message || "FAILED TO BOOST AD." };
  }
}

// 6. UPDATE / EDIT RENTAL AD (STRICTLY TITLE, DESCRIPTION, PRICE & AMENITIES ONLY)
export async function updateRentalAd(
  propertyId: string,
  data: {
    title: string;
    description: string;
    rentPrice: number;
    amenities?: string;
  }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "PLEASE LOGIN FIRST." };
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return { success: false, error: "PROPERTY NOT FOUND." };
    }

    if (existingProperty.userId !== session.id && session.role !== "ADMIN") {
      return { success: false, error: "UNAUTHORIZED: YOU CANNOT EDIT THIS AD." };
    }

    if (!data.title?.trim() || !data.description?.trim() || !data.rentPrice) {
      return { success: false, error: "TITLE, DESCRIPTION AND PRICE ARE REQUIRED." };
    }

    const updateData: any = {
      title: data.title.trim().toUpperCase(),
      description: data.description.trim(),
      rentPrice: Number(data.rentPrice),
    };

    if ("amenities" in existingProperty && data.amenities !== undefined) {
      updateData.amenities = data.amenities;
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
    });

    revalidatePath("/dashboard/my-ads");
    revalidatePath("/properties");
    revalidatePath(`/property/${propertyId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update property ad:", error);
    return { success: false, error: "FAILED TO UPDATE PROPERTY AD." };
  }
}


// 7. TRACK PROPERTY VIEW (Whenever someone visits the ad page)
export async function trackPropertyView(propertyId: string) {
  try {
    if (!propertyId) return { success: false };
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    // Analytics failure should never block user browsing
    return { success: false };
  }
}

// 8. TRACK PROPERTY LEAD (When visitor clicks Call or WhatsApp)
export async function trackPropertyLead(propertyId: string) {
  try {
    if (!propertyId) return { success: false };
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        leads: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}