/*
  Warnings:

  - You are about to drop the column `phonenumber` on the `User` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phonenumber",
ADD COLUMN     "phoneNumber" VARCHAR(50) NOT NULL,
ALTER COLUMN "password" SET DATA TYPE TEXT;
