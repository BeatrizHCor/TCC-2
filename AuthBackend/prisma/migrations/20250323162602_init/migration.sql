/*
  Warnings:

  - The primary key for the `AuthControl` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "AuthControl_Email_SalaoId_key";

-- DropIndex
DROP INDEX "AuthControl_UsuarioID_key";

-- AlterTable
ALTER TABLE "AuthControl" DROP CONSTRAINT "AuthControl_pkey",
ALTER COLUMN "Token" DROP NOT NULL,
ADD CONSTRAINT "AuthControl_pkey" PRIMARY KEY ("UsuarioID", "SalaoId");
