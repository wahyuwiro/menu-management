/*
  Warnings:

  - You are about to drop the column `name` on the `Menu` table. All the data in the column will be lost.
  - Added the required column `label` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL;
