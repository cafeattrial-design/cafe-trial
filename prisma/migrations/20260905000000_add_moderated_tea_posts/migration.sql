CREATE TABLE "TeaPost" (
    "id" TEXT NOT NULL,
    "cafeId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "audioDataUrl" TEXT,
    "receiptDataUrl" TEXT,
    "fireCount" INTEGER NOT NULL DEFAULT 0,
    "shockCount" INTEGER NOT NULL DEFAULT 0,
    "laughCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeaPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TeaPost_cafeId_status_createdAt_idx" ON "TeaPost"("cafeId", "status", "createdAt");

ALTER TABLE "TeaPost"
ADD CONSTRAINT "TeaPost_cafeId_fkey"
FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
