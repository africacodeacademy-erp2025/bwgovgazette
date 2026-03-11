-- Add vector(1536) embedding columns to SicNode and DocumentText.
-- Nullable so existing rows are unaffected.

ALTER TABLE "SicNode"
ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

ALTER TABLE "document_texts"
ADD COLUMN IF NOT EXISTS "embedding" vector(1536);
