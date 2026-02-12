/*
  Warnings:

  - The `processingStatus` column on the `documents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('pending', 'text_extracted', 'chunked', 'classified', 'reviewed', 'failed');

-- CreateEnum
CREATE TYPE "SicLevel" AS ENUM ('industry', 'division', 'class', 'group');

-- CreateEnum
CREATE TYPE "TagSource" AS ENUM ('ai', 'manual', 'rule');

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "processingStatus",
ADD COLUMN     "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "SicNode" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "level" "SicLevel" NOT NULL,
    "code" TEXT,
    "title" TEXT,
    "description" TEXT,
    "isDuplicate" BOOLEAN NOT NULL DEFAULT false,
    "isInferred" BOOLEAN NOT NULL DEFAULT false,
    "isTruncated" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "supersededBy" TEXT,
    "sourceDoc" TEXT,
    "sourcePage" INTEGER,
    "path" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SicNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSicTag" (
    "documentId" TEXT NOT NULL,
    "sicNodeId" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "tagSource" "TagSource" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DocumentSicTag_pkey" PRIMARY KEY ("documentId","sicNodeId")
);

-- CreateIndex
CREATE INDEX "SicNode_level_idx" ON "SicNode"("level");

-- CreateIndex
CREATE INDEX "SicNode_code_idx" ON "SicNode"("code");

-- CreateIndex
CREATE INDEX "SicNode_isActive_idx" ON "SicNode"("isActive");

-- CreateIndex
CREATE INDEX "DocumentSicTag_sicNodeId_idx" ON "DocumentSicTag"("sicNodeId");

-- AddForeignKey
ALTER TABLE "SicNode" ADD CONSTRAINT "SicNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SicNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSicTag" ADD CONSTRAINT "DocumentSicTag_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSicTag" ADD CONSTRAINT "DocumentSicTag_sicNodeId_fkey" FOREIGN KEY ("sicNodeId") REFERENCES "SicNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
