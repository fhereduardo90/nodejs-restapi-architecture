/*
  Warnings:

  - Added the required column `expires_at` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
