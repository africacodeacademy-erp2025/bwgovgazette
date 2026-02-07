-- CreateTable
CREATE TABLE "sic_nodes" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "level" TEXT NOT NULL,
    "code" TEXT,
    "title" TEXT,
    "description" TEXT,
    "isDuplicate" BOOLEAN NOT NULL DEFAULT false,
    "isInferred" BOOLEAN NOT NULL DEFAULT false,
    "isTruncated" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "path" TEXT,

    CONSTRAINT "sic_nodes_pkey" PRIMARY KEY ("id")
);
