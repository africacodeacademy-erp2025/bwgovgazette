# Setup Instructions

## Changes Made

### Schema Changes

1. **Added `DATABASE_URL`** to datasource in `prisma/schema.prisma`
2. **Added `DocumentChunk` model** with fields:
   - `id`: UUID primary key
   - `documentId`: Foreign key to Document
   - `index`: Integer for ordering chunks
   - `text`: Chunk content
   - `embedding`: JSON field for storing embeddings
   - Indexed on `[documentId, index]`
3. **Added `chunks` relation** to Document model

### Service Fixes

1. **Fixed import/export mismatches**:
   - Changed from default imports to named imports: `{ ocrService }`, `{ embeddingService }`, `{ summaryService }`

2. **Fixed method name typos**:
   - `ocrService.extractedText()` → `ocrService.extractText()`
   - Added `embeddingService.generateEmbedding()` method
   - Fixed `normalise()` → `normalize()` in Sharp
   - Fixed `promt` → `prompt` in summaryService

3. **Fixed return types**:
   - `ocrService.extractedTextFromPDF()` now returns proper object structure

4. **Refactored `documentService.processDocument()`**:
   - Uses `Document.fileUrl` instead of `filePath`
   - Creates `DocumentText` via relation (stores `content` and `summary`)
   - Creates `DocumentTag` entries via relation (instead of string array)
   - Creates `DocumentChunk` entries with embeddings stored as JSON
   - Uses `sourceType` instead of `category`
   - Accepts `file.url` parameter for Supabase URL

5. **Updated query methods**:
   - `getAllDocuments()`: includes text, tags relations; maps tags to strings
   - `getDocumentById()`: includes text, tags, chunks; orders chunks by index

### API Routes

1. **`/api/upload`** (NEW):
   - Accepts multipart form data with file, sourceType, tags
   - Uploads to Supabase Storage bucket `documents`
   - Saves temp file for OCR processing
   - Calls `documentService.processDocument()`
   - Returns document with metadata
   - Cleans up temp files

2. **`/api/documents`**:
   - Changed `category` param to `sourceType`
   - Returns documents with proper relations

3. **`/api/[id]`**:
   - Already correct; returns full document with relations

### Configuration

- **Removed** `accelerateUrl` misconfig from `libs/prisma.ts`
- Schema now uses `DATABASE_URL` environment variable

## Installation Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js sharp
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (from Supabase dashboard)
- `OPENAI_API_KEY`: OpenAI API key (optional, for embeddings/summaries)

### 3. Set Up Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Create a bucket named `documents`
3. Set bucket to **public** (or configure policies for your needs)
4. Optional: Set up RLS policies if needed

### 4. Run Prisma Migration

```bash
npx prisma migrate dev --name add_document_chunks
```

This will:

- Add the `DocumentChunk` table
- Add the relation to `Document`
- Update Prisma Client

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Create uploads directory

```bash
mkdir uploads
```

### 7. Start Development Server

```bash
npm run dev
```

## API Usage

### Upload a Document

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@document.pdf" \
  -F "sourceType=gazette" \
  -F "tags=legal,2026"
```

### Get All Documents

```bash
curl http://localhost:3000/api/documents?sourceType=gazette&limit=20&offset=0
```

### Get Document by ID

```bash
curl http://localhost:3000/api/documents/{id}
```

## Testing OCR Without Supabase (Optional)

If you want to test locally first, modify `documentService.processDocument()` to accept a simple file path and skip Supabase upload temporarily.

## Notes

- **Embeddings**: Requires `OPENAI_API_KEY`; chunks are stored with embeddings in JSON format
- **Summaries**: Requires `OPENAI_API_KEY`; stored in `DocumentText.summary`
- **File Storage**: Raw files stored in Supabase; temp files created for OCR then deleted
- **Processing**: Currently synchronous; consider async queues (Bull, BullMQ) for production
