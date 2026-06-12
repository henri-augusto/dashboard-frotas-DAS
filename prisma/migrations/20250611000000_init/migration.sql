-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('DISPONIVEL', 'EM_USO', 'BAIXADA');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ABERTO', 'ENCERRADO');

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "prefixo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "patrimonio" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleDischarge" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "dischargedAt" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "motivo" TEXT NOT NULL,
    "numeroProcesso" TEXT NOT NULL,
    "autorBaixa" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleDischarge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceReport" (
    "id" TEXT NOT NULL,
    "reMilitar" TEXT NOT NULL,
    "nomeGuerra" TEXT NOT NULL DEFAULT '',
    "vehicleId" TEXT NOT NULL,
    "kmInicial" INTEGER NOT NULL,
    "kmFinal" INTEGER,
    "destino" TEXT NOT NULL,
    "missao" TEXT NOT NULL,
    "encarregado" TEXT NOT NULL,
    "observacoes" TEXT,
    "novidades" TEXT,
    "status" "ServiceStatus" NOT NULL DEFAULT 'ABERTO',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_prefixo_key" ON "Vehicle"("prefixo");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "VehicleDischarge" ADD CONSTRAINT "VehicleDischarge_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReport" ADD CONSTRAINT "ServiceReport_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
