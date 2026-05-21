import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@das.local";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const vehicles = [
    {
      prefixo: "VTR-01",
      modelo: "Fiat Toro",
      patrimonio: "PAT-2024-001",
      placa: "ABC1D23",
      status: "DISPONIVEL" as const,
    },
    {
      prefixo: "VTR-02",
      modelo: "Chevrolet S10",
      patrimonio: "PAT-2024-002",
      placa: "DEF4G56",
      status: "DISPONIVEL" as const,
    },
    {
      prefixo: "VTR-03",
      modelo: "Toyota Hilux",
      patrimonio: "PAT-2024-003",
      placa: "GHI7J89",
      status: "BAIXADA" as const,
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { prefixo: v.prefixo },
      update: v,
      create: v,
    });
  }

  console.log("Seed concluído.");
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
