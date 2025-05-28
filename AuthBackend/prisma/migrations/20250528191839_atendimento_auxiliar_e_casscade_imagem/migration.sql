/*
  Warnings:

  - You are about to drop the column `FuncionarioID` on the `Atendimento` table. All the data in the column will be lost.
  - You are about to drop the column `SalaoId` on the `AtendimentoAuxiliar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_FuncionarioID_fkey";

-- DropForeignKey
ALTER TABLE "Imagem" DROP CONSTRAINT "Imagem_HistoricoSimulacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Imagem" DROP CONSTRAINT "Imagem_PortfolioId_fkey";

-- AlterTable
ALTER TABLE "Atendimento" DROP COLUMN "FuncionarioID";

-- AlterTable
ALTER TABLE "AtendimentoAuxiliar" DROP COLUMN "SalaoId";

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_PortfolioId_fkey" FOREIGN KEY ("PortfolioId") REFERENCES "Portfolio"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_HistoricoSimulacaoId_fkey" FOREIGN KEY ("HistoricoSimulacaoId") REFERENCES "HistoricoSimulacao"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
