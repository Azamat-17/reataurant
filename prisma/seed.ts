import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { regions } from "./data/regions";
import { cities } from "./data/cities";
import { slugify } from "./data/slugify";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding regions & districts...");
  for (const region of regions) {
    const createdRegion = await prisma.region.upsert({
      where: { slug: region.slug },
      update: {},
      create: { name: region.name, slug: region.slug },
    });

    for (const districtName of region.districts) {
      const districtSlug = slugify(districtName);
      await prisma.district.upsert({
        where: { regionId_name: { regionId: createdRegion.id, name: districtName } },
        update: {},
        create: { name: districtName, slug: districtSlug, regionId: createdRegion.id },
      });
    }
  }

  console.log("Seeding cities...");
  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: { name: city.name, slug: city.slug },
    });
  }

  console.log("Seeding admin user...");
  const adminPasswordHash = await bcrypt.hash("admin12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@resto.kg" },
    update: {},
    create: {
      email: "admin@resto.kg",
      passwordHash: adminPasswordHash,
      name: "Администратор",
      role: "ADMIN",
    },
  });

  console.log("Seeding owner users...");
  const ownerPasswordHash = await bcrypt.hash("owner12345", 10);
  const owner1 = await prisma.user.upsert({
    where: { email: "owner1@resto.kg" },
    update: {},
    create: {
      email: "owner1@resto.kg",
      passwordHash: ownerPasswordHash,
      name: "Владелец Вертели",
      role: "OWNER",
    },
  });
  const owner2 = await prisma.user.upsert({
    where: { email: "owner2@resto.kg" },
    update: {},
    create: {
      email: "owner2@resto.kg",
      passwordHash: ownerPasswordHash,
      name: "Владелец Дастор",
      role: "OWNER",
    },
  });
  const owner3 = await prisma.user.upsert({
    where: { email: "owner3@resto.kg" },
    update: {},
    create: {
      email: "owner3@resto.kg",
      passwordHash: ownerPasswordHash,
      name: "Владелец Иссык-Куль",
      role: "OWNER",
    },
  });

  console.log("Seeding demo user...");
  const userPasswordHash = await bcrypt.hash("user12345", 10);
  await prisma.user.upsert({
    where: { email: "user@resto.kg" },
    update: {},
    create: {
      email: "user@resto.kg",
      passwordHash: userPasswordHash,
      name: "Айгуль Тестова",
      role: "USER",
    },
  });

  const bishkek = await prisma.city.findUniqueOrThrow({ where: { slug: "bishkek" } });
  const osh = await prisma.city.findUniqueOrThrow({ where: { slug: "osh" } });
  const karakol = await prisma.city.findUniqueOrThrow({ where: { slug: "karakol" } });

  const bishkekRegion = await prisma.region.findUniqueOrThrow({ where: { slug: "bishkek" } });
  const oshRegion = await prisma.region.findUniqueOrThrow({ where: { slug: "osh" } });
  const issykKulRegion = await prisma.region.findUniqueOrThrow({ where: { slug: "issyk-kulskaya-oblast" } });
  const jetiOguz = await prisma.district.findFirstOrThrow({
    where: { name: "Джети-Огузский район", regionId: issykKulRegion.id },
  });

  console.log("Seeding sample restaurants...");

  const priceIconsSample = JSON.stringify([
    { icon: "cup", price: 2200 },
    { icon: "wine", price: 700 },
    { icon: "beer", price: 500 },
    { icon: "cocktail", price: 500 },
  ]);

  const restaurantsData = [
    {
      slug: "verteli-bishkek",
      name: "Вертели",
      nameSubtitle: "Verteli",
      description:
        "Ресторан кавказской и центральноазиатской кухни на углях, с уютной летней верандой в центре Бишкека.",
      address: "ул. Токтогула, 93",
      landmark: "ЦУМ Айчурек",
      landmarkDistanceM: 450,
      landmarkWalkMin: 6,
      cityId: bishkek.id,
      regionId: bishkekRegion.id,
      type: "Ресторан",
      avgCheck: 1200,
      capacity: 300,
      hasVeranda: true,
      hasOpenKitchen: true,
      hasOnlineBooking: true,
      hasDiscounts: false,
      ownerId: owner1.id,
      status: "APPROVED" as const,
      coverImage: null,
      priceIcons: priceIconsSample,
    },
    {
      slug: "dastor-bishkek",
      name: "Дастор",
      nameSubtitle: "Dastor",
      description: "Национальная кыргызская кухня: бешбармак, манты, лагман — домашние рецепты в современной подаче.",
      address: "пр. Чуй, 121",
      landmark: "Парк Панфилова",
      landmarkDistanceM: 300,
      landmarkWalkMin: 4,
      cityId: bishkek.id,
      regionId: bishkekRegion.id,
      type: "Кафе",
      avgCheck: 700,
      capacity: 150,
      hasVeranda: true,
      hasOpenKitchen: false,
      hasOnlineBooking: true,
      hasDiscounts: true,
      ownerId: owner2.id,
      status: "APPROVED" as const,
      coverImage: null,
      priceIcons: priceIconsSample,
    },
    {
      slug: "ala-too-osh",
      name: "Ала-Тоо",
      nameSubtitle: "Ala-Too",
      description: "Ошские плов-центры и восточные сладости, большой зал и открытая кухня с видом на казан.",
      address: "ул. Курманжан Датка, 45",
      landmark: "Ошский базар",
      landmarkDistanceM: 600,
      landmarkWalkMin: 8,
      cityId: osh.id,
      regionId: oshRegion.id,
      type: "Ресторан",
      avgCheck: 600,
      capacity: 400,
      hasVeranda: false,
      hasOpenKitchen: true,
      hasOnlineBooking: false,
      hasDiscounts: true,
      ownerId: owner2.id,
      status: "APPROVED" as const,
      coverImage: null,
      priceIcons: priceIconsSample,
    },
    {
      slug: "issyk-kul-terrace",
      name: "Иссык-Куль Террас",
      nameSubtitle: "Issyk-Kul Terrace",
      description: "Ресторан с панорамной верандой на берегу Иссык-Куля: свежая рыба, шашлыки, летние коктейли.",
      address: "с. Григорьевка, побережье",
      landmark: "Григорьевское ущелье",
      landmarkDistanceM: 1200,
      landmarkWalkMin: 15,
      cityId: karakol.id,
      regionId: issykKulRegion.id,
      districtId: jetiOguz.id,
      type: "Ресторан",
      avgCheck: 1500,
      capacity: 200,
      hasVeranda: true,
      hasOpenKitchen: true,
      hasOnlineBooking: true,
      hasDiscounts: false,
      ownerId: owner3.id,
      status: "APPROVED" as const,
      coverImage: null,
      priceIcons: priceIconsSample,
    },
    {
      slug: "sunrise-cafe-bishkek",
      name: "Sunrise Cafe",
      nameSubtitle: "Санрайз Кафе",
      description: "Кофейня и завтраки весь день, недавно опубликована владельцем и ожидает проверки модератором.",
      address: "ул. Ахунбаева, 119",
      landmark: "ТРЦ Дордой Плаза",
      landmarkDistanceM: 250,
      landmarkWalkMin: 3,
      cityId: bishkek.id,
      regionId: bishkekRegion.id,
      type: "Кафе",
      avgCheck: 500,
      hasVeranda: false,
      hasOpenKitchen: false,
      hasOnlineBooking: false,
      hasDiscounts: false,
      ownerId: owner1.id,
      status: "PENDING" as const,
      coverImage: null,
      priceIcons: priceIconsSample,
    },
  ];

  for (const data of restaurantsData) {
    const { slug, ...rest } = data;
    await prisma.restaurant.upsert({
      where: { slug },
      update: rest,
      create: data,
    });
  }

  console.log("Seed complete.");
  console.log({ admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
