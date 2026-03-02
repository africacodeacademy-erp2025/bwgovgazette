import { prisma } from "../prisma";

const HAS_CONTENT_EXPR =
  'CASE WHEN "description" IS NOT NULL AND LENGTH(TRIM("description")) >= 40 THEN true ELSE false END';

async function updateHasContent() {
  // Ensure the column exists before updating
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "SicNode"
    ADD COLUMN IF NOT EXISTS "hasContent" BOOLEAN NOT NULL DEFAULT false
  `);

  const updatedCount = await prisma.$executeRawUnsafe(`
    UPDATE "SicNode"
    SET "hasContent" = ${HAS_CONTENT_EXPR}
    WHERE "hasContent" IS DISTINCT FROM ${HAS_CONTENT_EXPR}
  `);

  console.log(`Updated ${updatedCount} SicNode rows.`);
}

updateHasContent()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to update SicNode hasContent flags");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
