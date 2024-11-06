-- DropIndex
DROP INDEX "UserStyle_userId_styleId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "isLookingForBand" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOpenToOffers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lookingForSkills" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "UserStyle" ADD COLUMN     "groupId" INTEGER;

-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "likerUserId" INTEGER,
    "likerGroupId" INTEGER,
    "likedUserId" INTEGER,
    "likedGroupId" INTEGER,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "description" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "cityId" INTEGER,
    "links" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isOpenToOffers" BOOLEAN NOT NULL DEFAULT false,
    "lookingForSkills" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "avatar" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likerUserId_likedUserId_key" ON "Likes"("likerUserId", "likedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likerUserId_likedGroupId_key" ON "Likes"("likerUserId", "likedGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likerGroupId_likedUserId_key" ON "Likes"("likerGroupId", "likedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likerGroupId_likedGroupId_key" ON "Likes"("likerGroupId", "likedGroupId");

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likerUserId_fkey" FOREIGN KEY ("likerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likerGroupId_fkey" FOREIGN KEY ("likerGroupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likedUserId_fkey" FOREIGN KEY ("likedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likedGroupId_fkey" FOREIGN KEY ("likedGroupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStyle" ADD CONSTRAINT "UserStyle_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
