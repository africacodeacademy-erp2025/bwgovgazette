-- Add hasContent flag for SicNode
ALTER TABLE "SicNode"
ADD COLUMN "hasContent" BOOLEAN NOT NULL DEFAULT false;
