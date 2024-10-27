/*
  Warnings:

  - Added the required column `color` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vin` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `mileage` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Gasoline', 'Diesel', 'Electric', 'Hybrid');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('AUTOMATIC', 'MANUAL');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "fuelType" "FuelType" NOT NULL,
ADD COLUMN     "transmission" "Transmission" NOT NULL,
ADD COLUMN     "vin" TEXT NOT NULL,
DROP COLUMN "mileage",
ADD COLUMN     "mileage" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "availabilityStatus" SET DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'BUYER';
