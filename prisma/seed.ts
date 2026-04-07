import { PrismaClient } from "@prisma/client";
import { mockCatalog } from "../lib/data/mock-products";

const prisma = new PrismaClient();

const trustScores: Record<string, number> = {
  Amazon: 0.88,
  "Best Buy": 0.91,
  Walmart: 0.83,
  Target: 0.8
};

async function main() {
  await prisma.seedProduct.deleteMany();
  await prisma.search.deleteMany();
  await prisma.cachedSearchResult.deleteMany();

  await prisma.seedProduct.createMany({
    data: mockCatalog.map((product) => ({
      title: product.title,
      source: product.source,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviewCount: product.reviewCount,
      trustScore: trustScores[product.source],
      category: product.category
    }))
  });

  await prisma.search.createMany({
    data: [
      { query: "iPhone 15 Pro", resultCount: 4 },
      { query: "best 27 inch 1440p monitor under $250", resultCount: 4 },
      { query: "wireless noise cancelling headphones", resultCount: 4 }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
