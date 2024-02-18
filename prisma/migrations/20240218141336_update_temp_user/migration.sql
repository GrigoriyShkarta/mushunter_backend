/*
  Warnings:

  - A unique constraint covering the columns `[tempToken]` on the table `TempAuthData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tempToken` to the `TempAuthData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TempAuthData" ADD COLUMN     "tempToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TempAuthData_tempToken_key" ON "TempAuthData"("tempToken");
