/*
  Warnings:

  - You are about to drop the `Gastos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Holerite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PagamentosAssinatura` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ImagemTipo" AS ENUM ('Analoga', 'Analoga2', 'Complementar', 'Portfolio');

-- DropForeignKey
ALTER TABLE "Gastos" DROP CONSTRAINT "Gastos_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_CabeleireiroID_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_FuncionarioID_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "PagamentosAssinatura" DROP CONSTRAINT "PagamentosAssinatura_SalaoId_fkey";

-- AlterTable
ALTER TABLE "Imagem" ADD COLUMN     "Tipo" "ImagemTipo" NOT NULL DEFAULT 'Portfolio';

-- DropTable
DROP TABLE "Gastos";

-- DropTable
DROP TABLE "Holerite";

-- DropTable
DROP TABLE "PagamentosAssinatura";

-- DropEnum
DROP TYPE "StatusPagamento";
