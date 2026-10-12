-- CreateTable
CREATE TABLE "StoredImage" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'image/webp',
    "data" BYTEA NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "originalName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoredImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoredImage_category_idx" ON "StoredImage"("category");

-- CreateIndex
CREATE INDEX "StoredImage_createdAt_idx" ON "StoredImage"("createdAt");
