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

---

## Authentication & Authorization Setup

### Overview

The system implements JWT-based authentication with role-based access control (RBAC). Two roles are included:
- **ADMIN**: Manage users, taxonomy, upload and manage documents
- **USER**: Read and search documents only (default role)

### Installation

#### 1. Install Authentication Dependencies

```bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

#### 2. Update Environment Variables

Add the following to your `.env` file:

```bash
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-recommended
```

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. Run Database Migration

Create the User and Role tables:

```bash
npx prisma migrate dev --name add_auth_models
```

This will:
- Create `User` table with email, hashed password, and roleId
- Create `Role` table with name and permissions
- Add `userId` foreign key to `Document` table

#### 4. Seed Initial Roles (Optional)

```bash
npx ts-node --project tsconfig.scripts.json libs/parser/seed.ts
```

Or manually create roles via Prisma:

```bash
npx prisma studio
```

Create two documents in the `Role` table:
```json
[
  { "name": "ADMIN", "description": "Administrator", "permissions": ["manage:all", "upload", "classify"] },
  { "name": "USER", "description": "Regular User", "permissions": ["read", "search", "download"] }
]
```

### API Endpoints

#### Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Secure123!"
  }'
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Secure123!"
  }'
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

Token is automatically set as `authToken` HttpOnly cookie.

#### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

**Response (200):**
```json
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "USER",
    "roleId": "role-uuid",
    "permissions": ["read", "search", "download"]
  }
}
```

#### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

Token cookie is cleared.

### Protected Routes

#### Upload Document (ADMIN only)

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@document.pdf" \
  -F "sourceType=gazette" \
  -F "tags=legal,2026"
```

Returns **403 Forbidden** if user role is not ADMIN.

#### Get Documents (Authenticated Users)

```bash
curl -X GET http://localhost:3000/api/documents?limit=20 \
  -H "Authorization: Bearer {token}"
```

Returns **401 Unauthorized** if not authenticated.

### Using Authentication in Frontend

The token is stored as an HttpOnly cookie, so it's automatically sent with requests. For additional security with API calls, you can also send it via Authorization header:

```javascript
// Register
const registerRes = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include', // Send cookies
});

// Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include',
});

// Get current user
const meRes = await fetch('/api/auth/me', {
  credentials: 'include', // Sends authToken cookie
});

// Upload with Bearer token (alternative to cookie)
const uploadRes = await fetch('/api/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData,
});
```

### Architecture

**JWT Utilities** (`libs/utils/jwtUtils.ts`):
- `generateToken()`: Create JWT with userId, email, role
- `verifyToken()`: Verify and decode JWT
- `extractToken()`: Extract from Bearer header or cookies
- Token expiry: 1 day

**Password Utilities** (`libs/utils/passwordUtils.ts`):
- `hashPassword()`: Bcrypt hashing (10 rounds)
- `comparePassword()`: Verify password against hash
- `validatePassword()`: Enforce password strength

**Auth Service** (`libs/services/authService.ts`):
- `registerUser()`: Create user with validation
- `authenticateUser()`: Login and generate token
- `getUserById()`: Fetch user with role/permissions

**Auth Helpers** (`libs/utils/authHelpers.ts`):
- `authenticateRequest()`: Extract and verify JWT from request
- `requireRole()`: Middleware to check user role
- `requirePermission()`: Check specific permissions

### Error Responses

| Status | Scenario |
|--------|----------|
| 400 | Invalid input (missing email/password, weak password) |
| 401 | Invalid credentials, missing token, expired token |
| 403 | Insufficient permissions/role |
| 500 | Server error |

### Next Steps (Optional)

1. **Refresh Tokens**: Add token rotation for improved security
2. **Email Verification**: Send verification email on registration
3. **Admin Panel**: UI for user and role management
4. **Password Reset**: Forgot password flow with email
5. **Session Management**: Track active sessions per user
6. **Audit Logging**: Log authentication events
