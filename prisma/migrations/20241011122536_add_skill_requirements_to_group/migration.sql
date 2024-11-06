/*
  Warnings:

  - You are about to drop the column `lookingForSkills` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `lookingForSkills` on the `User` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserStyle" DROP CONSTRAINT "UserStyle_styleId_fkey";

-- DropForeignKey
ALTER TABLE "UserStyle" DROP CONSTRAINT "UserStyle_userId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "lookingForSkills",
ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lookingForSkills";

-- AlterTable
ALTER TABLE "UserSkill" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "UserStyle" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "styleId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "role" INTEGER[],

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillRequirement" (
    "id" SERIAL NOT NULL,
    "skillId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "minExperience" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SkillRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_userId_groupId_key" ON "GroupMember"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequirement" ADD CONSTRAINT "SkillRequirement_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequirement" ADD CONSTRAINT "SkillRequirement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequirement" ADD CONSTRAINT "SkillRequirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStyle" ADD CONSTRAINT "UserStyle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStyle" ADD CONSTRAINT "UserStyle_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;
