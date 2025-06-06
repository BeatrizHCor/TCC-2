/*
  Warnings:

  - Added the required column `Nome` to the `ServicoAgendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServicoAgendamento" ADD COLUMN     "Nome" TEXT NOT NULL;
