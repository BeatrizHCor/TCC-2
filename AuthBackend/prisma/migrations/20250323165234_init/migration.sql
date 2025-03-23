/*
  Warnings:

  - The primary key for the `AuthControl` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AuthControl" DROP CONSTRAINT "AuthControl_pkey",
ADD CONSTRAINT "AuthControl_pkey" PRIMARY KEY ("UsuarioID");
