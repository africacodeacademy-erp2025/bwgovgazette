-- 1. Add tsvector column
ALTER TABLE "document_texts"
  ADD COLUMN "tsv" tsvector;

-- 2. Populate from existing content
UPDATE "document_texts"
  SET "tsv" = to_tsvector('english', COALESCE("content", ''));

-- 3. GIN index for fast full-text queries
CREATE INDEX "document_texts_tsv_idx"
  ON "document_texts" USING GIN ("tsv");
