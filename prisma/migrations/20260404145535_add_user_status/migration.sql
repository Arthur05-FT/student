/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");
