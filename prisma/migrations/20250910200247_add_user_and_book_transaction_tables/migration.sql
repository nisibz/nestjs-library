-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookTransaction" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "borrowDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "BookTransaction_bookId_idx" ON "public"."BookTransaction"("bookId");

-- CreateIndex
CREATE INDEX "BookTransaction_userId_idx" ON "public"."BookTransaction"("userId");

-- CreateIndex
CREATE INDEX "BookTransaction_borrowDate_idx" ON "public"."BookTransaction"("borrowDate");

-- AddForeignKey
ALTER TABLE "public"."BookTransaction" ADD CONSTRAINT "BookTransaction_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookTransaction" ADD CONSTRAINT "BookTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
