-- Create vector similarity index for SicNode embeddings.
--
-- Requirements:
-- 1. Use ivfflat with vector_cosine_ops
-- 2. Lists = 100
-- 3. Idempotent (IF NOT EXISTS)

CREATE INDEX IF NOT EXISTS sicnode_embedding_idx
ON "SicNode"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

ANALYZE "SicNode";
