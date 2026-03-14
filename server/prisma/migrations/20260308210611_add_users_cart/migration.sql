/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "createdAt",
DROP COLUMN "total";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
