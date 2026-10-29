import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PropVerse...");

  const lahore = await prisma.location.upsert({
    where: { slug: "lahore" },
    update: {},
    create: { name: "Lahore", level: "CITY", slug: "lahore" },
  });
  const karachi = await prisma.location.upsert({
    where: { slug: "karachi" },
    update: {},
    create: { name: "Karachi", level: "CITY", slug: "karachi" },
  });
  const islamabad = await prisma.location.upsert({
    where: { slug: "islamabad" },
    update: {},
    create: { name: "Islamabad", level: "CITY", slug: "islamabad" },
  });

  const dha5 = await prisma.society.upsert({
    where: { id: "11111111-1111-4111-8111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-4111-8111-111111111111",
      name: "DHA Phase 5",
      cityId: lahore.id,
      authority: "LDA",
      totalPlots: 1200,
    },
  });
  const bahria = await prisma.society.upsert({
    where: { id: "22222222-2222-4222-8222-222222222222" },
    update: {},
    create: {
      id: "22222222-2222-4222-8222-222222222222",
      name: "Bahria Town",
      cityId: karachi.id,
      authority: "PRIVATE",
      totalPlots: 5000,
    },
  });
  const dhaIsb = await prisma.society.upsert({
    where: { id: "33333333-3333-4333-8333-333333333333" },
    update: {},
    create: {
      id: "33333333-3333-4333-8333-333333333333",
      name: "DHA Islamabad",
      cityId: islamabad.id,
      authority: "CDA",
      totalPlots: 800,
    },
  });

  const owner = await prisma.user.upsert({
    where: { phone: "03001234567" },
    update: {},
    create: {
      phone: "03001234567",
      fullName: "Demo Owner",
      role: "OWNER",
      verificationStatus: "VERIFIED",
    },
  });

  const samples = [
    {
      title: "10 Marla Plot — DHA Phase 5, Sector B",
      purpose: "SALE" as const,
      category: "RESIDENTIAL" as const,
      type: "PLOT" as const,
      areaValue: 10,
      areaUnit: "MARLA" as const,
      priceAmount: BigInt(245_000_000_00), // 2.45 Cr in paisa
      latitude: 31.4697,
      longitude: 74.4081,
      cityId: lahore.id,
      societyId: dha5.id,
      constructionState: "PLOT_ONLY" as const,
      possession: "PHYSICAL" as const,
    },
    {
      title: "5 Marla House — Bahria Town Karachi",
      purpose: "SALE" as const,
      category: "RESIDENTIAL" as const,
      type: "HOUSE" as const,
      areaValue: 5,
      areaUnit: "MARLA" as const,
      priceAmount: BigInt(185_000_000_00),
      latitude: 25.0124,
      longitude: 67.3121,
      cityId: karachi.id,
      societyId: bahria.id,
      bedrooms: 3,
      bathrooms: 3,
      constructionState: "FINISHED" as const,
      possession: "PHYSICAL" as const,
    },
    {
      title: "1 Kanal Villa — DHA Islamabad",
      purpose: "SALE" as const,
      category: "RESIDENTIAL" as const,
      type: "VILLA" as const,
      areaValue: 1,
      areaUnit: "KANAL" as const,
      priceAmount: BigInt(750_000_000_00),
      latitude: 33.5205,
      longitude: 73.1589,
      cityId: islamabad.id,
      societyId: dhaIsb.id,
      bedrooms: 5,
      bathrooms: 6,
      constructionState: "FINISHED" as const,
      possession: "PHYSICAL" as const,
      corner: true,
      parkFacing: true,
    },
    {
      title: "3 Marla Flat for Rent — Lahore",
      purpose: "RENT" as const,
      category: "RESIDENTIAL" as const,
      type: "FLAT" as const,
      areaValue: 3,
      areaUnit: "MARLA" as const,
      priceAmount: BigInt(85_000_00), // 85,000 PKR/month
      latitude: 31.5204,
      longitude: 74.3587,
      cityId: lahore.id,
      bedrooms: 2,
      bathrooms: 2,
      constructionState: "FINISHED" as const,
    },
    {
      title: "Commercial Shop — Bahria Town",
      purpose: "SALE" as const,
      category: "COMMERCIAL" as const,
      type: "SHOP" as const,
      areaValue: 4,
      areaUnit: "MARLA" as const,
      priceAmount: BigInt(320_000_000_00),
      latitude: 25.02,
      longitude: 67.32,
      cityId: karachi.id,
      societyId: bahria.id,
    },
  ];

  for (const s of samples) {
    const existing = await prisma.property.findFirst({
      where: { title: s.title, ownerId: owner.id },
    });
    if (!existing) {
      await prisma.property.create({
        data: {
          ...s,
          ownerId: owner.id,
          description: `${s.title}. Seed listing for PropVerse demo. Contact via in-app chat.`,
          status: "ACTIVE",
          isVerified: true,
          publishedAt: new Date(),
          currency: "PKR",
          priceType: "NEGOTIABLE",
        },
      });
    }
  }

  // Sample plots for DHA Phase 5
  for (let i = 1; i <= 20; i++) {
    const plotNo = String(200 + i);
    await prisma.plot.upsert({
      where: {
        societyId_block_plotNo: {
          societyId: dha5.id,
          block: "B",
          plotNo,
        },
      },
      update: {},
      create: {
        societyId: dha5.id,
        phase: "5",
        block: "B",
        plotNo,
        areaValue: i % 3 === 0 ? 10 : 5,
        areaUnit: "MARLA",
        status: i % 5 === 0 ? "SOLD" : i % 7 === 0 ? "ON_HOLD" : "AVAILABLE",
      },
    });
  }

  const count = await prisma.property.count();
  console.log(`Seed done. Properties: ${count}, Societies: 3, Plots: 20`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
