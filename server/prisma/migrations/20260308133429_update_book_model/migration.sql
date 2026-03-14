-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "isFeatured" BOOLEAN,
ADD COLUMN     "isbn" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "pages" INTEGER,
ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "reviewCount" INTEGER,
ADD COLUMN     "samplePdf" TEXT;
