/*
  Warnings:

  - Added the required column `updatedAt` to the `SicNode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('core', 'phrase', 'verb', 'synonym', 'negative', 'boost');

-- CreateEnum
CREATE TYPE "SignalSource" AS ENUM ('auto', 'ai', 'manual');

-- AlterTable
ALTER TABLE "SicNode" ADD COLUMN     "embedding" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- CreateTable
CREATE TABLE "SicSignal" (
    "id" TEXT NOT NULL,
    "sicNodeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "normalizedValue" TEXT NOT NULL,
    "type" "SignalType" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "specificityScore" DOUBLE PRECISION NOT NULL,
    "minFrequency" INTEGER,
    "maxFrequency" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdBy" "SignalSource" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SicSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SicSignal_sicNodeId_idx" ON "SicSignal"("sicNodeId");

-- CreateIndex
CREATE INDEX "SicSignal_normalizedValue_idx" ON "SicSignal"("normalizedValue");

-- CreateIndex
CREATE INDEX "SicSignal_type_idx" ON "SicSignal"("type");

-- AddForeignKey
ALTER TABLE "SicSignal" ADD CONSTRAINT "SicSignal_sicNodeId_fkey" FOREIGN KEY ("sicNodeId") REFERENCES "SicNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
