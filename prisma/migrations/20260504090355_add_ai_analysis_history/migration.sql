-- CreateTable
CREATE TABLE "AIAnalysisHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnalysisHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIAnalysisHistory_userId_idx" ON "AIAnalysisHistory"("userId");

-- AddForeignKey
ALTER TABLE "AIAnalysisHistory" ADD CONSTRAINT "AIAnalysisHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
