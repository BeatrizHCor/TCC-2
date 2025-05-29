/*
  Warnings:

  - A unique constraint covering the columns `[AtendimentoId,AuxiliarID]` on the table `AtendimentoAuxiliar` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AtendimentoAuxiliar" DROP CONSTRAINT "AtendimentoAuxiliar_AtendimentoId_fkey";

-- DropForeignKey
ALTER TABLE "ServicoAtendimento" DROP CONSTRAINT "ServicoAtendimento_AtendimentoId_fkey";

-- DropIndex
DROP INDEX "AtendimentoAuxiliar_AtendimentoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AtendimentoAuxiliar_AtendimentoId_AuxiliarID_key" ON "AtendimentoAuxiliar"("AtendimentoId", "AuxiliarID");

-- AddForeignKey
ALTER TABLE "AtendimentoAuxiliar" ADD CONSTRAINT "AtendimentoAuxiliar_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES "Atendimento"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoAtendimento" ADD CONSTRAINT "ServicoAtendimento_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES "Atendimento"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
