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

## Authentication Setup

### Schema Changes for Auth

1. **Added `User` model**:
   - `id`: Supabase user ID
   - `email`: Unique email address
   - `firstName`, `lastName`: Optional user profile
   - `role`: User role (user, moderator, admin)
   - `isActive`: Account status
   - Relations: `documents` and `sicSignals`

2. **Added user relationships**:
   - `Document.userId`: Foreign key to User (enforces row-level security)
   - `SicSignal.createdById`: Optional user who created the signal

### New Auth Files

1. **`libs/auth.ts`**:
   - `extractToken()`: Extract JWT from Authorization header
   - `verifyToken()`: Verify token with Supabase
   - `getUserFromHeaders()`: Get user from request headers
   - `syncSupabaseUser()`: Create/update user in database

2. **`libs/authMiddleware.ts`**:
   - `requireAuth()`: Middleware to protect routes (returns 401 if not authenticated)
   - `getOptionalUser()`: Optional auth (returns null if not authenticated)

### Protected API Routes

All document routes now require authentication:

- **`POST /api/upload`**: Requires Bearer token; tags documents with user's ID
- **`GET /api/documents`**: Requires Bearer token; returns only user's documents
- **`GET /api/[id]`**: Requires Bearer token; returns document only if user owns it
- **`POST /api/auth/signup`**: Public; creates new user
- **`POST /api/auth/login`**: Public; signs in user
- **`POST /api/auth/logout`**: Optional; client-side token revocation
- **`GET /api/auth/me`**: Requires Bearer token; returns current user profile

### Row-Level Security

All document queries now enforce user isolation:

```typescript
// Only return documents owned by the authenticated user
getAllDocuments({ userId, sourceType, limit, offset })
getDocumentById(id, userId) // Checks both id AND userId
```

### Auth API Examples

#### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

Response:
```json
{
  "success": true,
  "user": { ... },
  "session": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "...",
    "expiresIn": 3600
  }
}
```

#### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {accessToken}"
```

#### Upload Document (Protected)
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer {accessToken}" \
  -F "file=@document.pdf" \
  -F "sourceType=gazette" \
  -F "tags=important,finance"
```

#### Get Documents (Protected, Row-Level)
```bash
curl -X GET "http://localhost:3000/api/documents?sourceType=gazette&limit=10" \
  -H "Authorization: Bearer {accessToken}"
```

### Running Migrations

After updating the schema:

```bash
# Apply migrations
npx prisma migrate deploy

# Or during development
npx prisma migrate dev
```

This will:
1. Create the `users` table
2. Add `userId` to `documents` table
3. Add `createdById` to `SicSignal` table
4. Create necessary indexes

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
