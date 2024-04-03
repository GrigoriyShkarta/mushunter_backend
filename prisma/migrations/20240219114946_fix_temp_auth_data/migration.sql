/*
  Warnings:

  - You are about to drop the column `tempToken` on the `TempAuthData` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TempAuthData_tempToken_key";

-- AlterTable
ALTER TABLE "TempAuthData" DROP COLUMN "tempToken";
