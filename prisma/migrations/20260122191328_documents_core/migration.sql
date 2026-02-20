-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'gazette',
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "processingStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_texts" (
    "documentId" TEXT NOT NULL,
    "content" TEXT,
    "summary" TEXT,
    "extractedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_texts_pkey" PRIMARY KEY ("documentId")
);

-- CreateTable
CREATE TABLE "document_tags" (
    "documentId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "document_tags_pkey" PRIMARY KEY ("documentId","tag")
);

-- AddForeignKey
ALTER TABLE "document_texts" ADD CONSTRAINT "document_texts_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_tags" ADD CONSTRAINT "document_tags_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
