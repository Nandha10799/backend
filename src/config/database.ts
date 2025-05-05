import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable query logging
});

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ MySQL Database Connected Successfully!");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1); // Exit if DB connection fails
  }
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("🔌 Disconnecting Prisma...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🔌 Disconnecting Prisma...");
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma, connectDB };
