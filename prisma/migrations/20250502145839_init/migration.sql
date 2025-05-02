-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "leetcodeUrl" TEXT NOT NULL,
    "neetcodeUrl" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "lastReviewed" TIMESTAMP(3),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "idx_problems_filter" ON "Problem"("difficulty", "status", "categoryName");

-- CreateIndex
CREATE INDEX "idx_problems_search" ON "Problem"("title", "categoryName");

-- CreateIndex
CREATE INDEX "idx_problems_review" ON "Problem"("lastReviewed", "reviewCount");

-- CreateIndex
CREATE INDEX "idx_problems_status" ON "Problem"("status");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
