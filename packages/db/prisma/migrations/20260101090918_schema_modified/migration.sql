/*
  Warnings:

  - You are about to drop the column `verifed` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "verifed",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
