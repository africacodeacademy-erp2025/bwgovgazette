-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('core', 'phrase', 'verb', 'synonym', 'negative', 'boost');

-- CreateTable
CREATE TABLE "SicSignal" (
    "id" TEXT NOT NULL,
    "sicNodeId" TEXT NOT NULL,
    "signal" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "type" "SignalType" NOT NULL,
    "specificity" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "SicSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SicSignal_sicNodeId_idx" ON "SicSignal"("sicNodeId");

-- CreateIndex
CREATE INDEX "SicSignal_signal_idx" ON "SicSignal"("signal");

-- CreateIndex
CREATE INDEX "SicSignal_specificity_idx" ON "SicSignal"("specificity");

-- AddForeignKey
ALTER TABLE "SicSignal" ADD CONSTRAINT "SicSignal_sicNodeId_fkey" FOREIGN KEY ("sicNodeId") REFERENCES "SicNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
