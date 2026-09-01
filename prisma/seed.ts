import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Master Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@gorentaldha.com" },
    update: {},
    create: {
      name: "GO RENTAL ADMIN",
      email: "admin@gorentaldha.com",
      phone: "+92 300 1234567",
      role: "ADMIN" as any,
      wallet: {
        create: {
          adCredits: 9999,
          boostCredits: 9999,
        },
      },
    },
  });

  // 2. Create Demo DHA Agent
  const demoAgent = await prisma.user.upsert({
    where: { email: "user@gorentaldha.com" },
    update: {},
    create: {
      name: "DHA Property Dealer",
      email: "user@gorentaldha.com",
      phone: "+92 321 7654321",
      role: "AGENT" as any,
      wallet: {
        create: {
          adCredits: 5,
          boostCredits: 1,
        },
      },
    },
  });

  console.log("Seed successful:", { admin: admin.email, demoAgent: demoAgent.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });