-- Migration: fix_sic_signal_columns
--
-- The SicSignal table was originally created with a single `signal` column.
-- The Prisma schema was later updated to split this into `signalValue`
-- (original extracted text) and `normalizedValue` (lowercased/normalised form
-- used for deterministic matching), and to add governance columns
-- (isActive, createdBy, updatedAt).
--
-- This migration brings the database in line with the current schema.

-- ── 1. Add new columns with safe defaults ───────────────────────────────────
ALTER TABLE "SicSignal"
  ADD COLUMN IF NOT EXISTS "signalValue"     TEXT,
  ADD COLUMN IF NOT EXISTS "normalizedValue" TEXT,
  ADD COLUMN IF NOT EXISTS "isActive"        BOOLEAN      NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "createdBy"       TEXT         NOT NULL DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ── 2. Copy existing signal data into both new text columns ─────────────────
UPDATE "SicSignal"
SET "signalValue"     = "signal",
    "normalizedValue" = "signal"
WHERE "signalValue" IS NULL OR "normalizedValue" IS NULL;

-- ── 3. Make text columns NOT NULL now that data is populated ─────────────────
ALTER TABLE "SicSignal"
  ALTER COLUMN "signalValue"     SET NOT NULL,
  ALTER COLUMN "normalizedValue" SET NOT NULL;

-- ── 4. Fix weight column type (was INTEGER, schema requires DOUBLE PRECISION) ─
ALTER TABLE "SicSignal"
  ALTER COLUMN "weight" TYPE DOUBLE PRECISION USING "weight"::DOUBLE PRECISION;

-- ── 5. Drop the old signal column and its index ──────────────────────────────
DROP INDEX IF EXISTS "SicSignal_signal_idx";

ALTER TABLE "SicSignal" DROP COLUMN IF EXISTS "signal";

-- ── 6. Add new indexes ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "SicSignal_normalizedValue_idx" ON "SicSignal"("normalizedValue");
CREATE INDEX IF NOT EXISTS "SicSignal_type_idx"            ON "SicSignal"("type");

-- ── 7. Add unique constraint (skip if already exists) ───────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'SicSignal_sicNodeId_normalizedValue_type_key'
  ) THEN
    ALTER TABLE "SicSignal"
      ADD CONSTRAINT "SicSignal_sicNodeId_normalizedValue_type_key"
      UNIQUE ("sicNodeId", "normalizedValue", "type");
  END IF;
END
$$;
