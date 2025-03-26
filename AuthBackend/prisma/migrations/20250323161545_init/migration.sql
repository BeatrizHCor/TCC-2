/*
  Warnings:

  - The primary key for the `AdmSalao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Agendamentos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CabeleireiroEmail` on the `Agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `ClienteEmail` on the `Agendamentos` table. All the data in the column will be lost.
  - The primary key for the `Atendimento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `FuncionarioEmail` on the `Atendimento` table. All the data in the column will be lost.
  - You are about to drop the column `AuxiliarEmail` on the `AtendimentoAuxiliar` table. All the data in the column will be lost.
  - The primary key for the `AuthControl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Cabeleireiro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Funcionario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Gastos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HistoricoSimulacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ClienteEmail` on the `HistoricoSimulacao` table. All the data in the column will be lost.
  - The primary key for the `Holerite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CabeleireiroEmail` on the `Holerite` table. All the data in the column will be lost.
  - You are about to drop the column `FuncionarioEmail` on the `Holerite` table. All the data in the column will be lost.
  - The primary key for the `Imagem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PagamentosAssinatura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Portfolio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CabeleireiroEmail` on the `Portfolio` table. All the data in the column will be lost.
  - The primary key for the `Salao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Servico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ServicoAtendimento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[Email,SalaoId]` on the table `AdmSalao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UsuarioID]` on the table `AuthControl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email,SalaoId]` on the table `AuthControl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email,SalaoId]` on the table `Cabeleireiro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email,SalaoId]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email,SalaoId]` on the table `Funcionario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CabeleireiroID]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - The required column `ID` was added to the `AdmSalao` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `ID` was added to the `AdmSistema` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `CabeleireiroID` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ClienteID` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FuncionarioID` to the `Atendimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AuxiliarID` to the `AtendimentoAuxiliar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UsuarioID` to the `AuthControl` table without a default value. This is not possible if the table is not empty.
  - The required column `ID` was added to the `Cabeleireiro` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `ID` was added to the `Cliente` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `ID` was added to the `Funcionario` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ClienteID` to the `HistoricoSimulacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CabeleireiroID` to the `Holerite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FuncionarioID` to the `Holerite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CabeleireiroID` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - The required column `ID` was added to the `Salao` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "AdmSalao" DROP CONSTRAINT "AdmSalao_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_CabeleireiroEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_ClienteEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_FuncionarioEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "AtendimentoAuxiliar" DROP CONSTRAINT "AtendimentoAuxiliar_AtendimentoId_fkey";

-- DropForeignKey
ALTER TABLE "AtendimentoAuxiliar" DROP CONSTRAINT "AtendimentoAuxiliar_AuxiliarEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Cabeleireiro" DROP CONSTRAINT "Cabeleireiro_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Gastos" DROP CONSTRAINT "Gastos_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricoSimulacao" DROP CONSTRAINT "HistoricoSimulacao_ClienteEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricoSimulacao" DROP CONSTRAINT "HistoricoSimulacao_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_CabeleireiroEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_FuncionarioEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Imagem" DROP CONSTRAINT "Imagem_HistoricoSimulacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Imagem" DROP CONSTRAINT "Imagem_PortfolioId_fkey";

-- DropForeignKey
ALTER TABLE "PagamentosAssinatura" DROP CONSTRAINT "PagamentosAssinatura_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_CabeleireiroEmail_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "Servico" DROP CONSTRAINT "Servico_SalaoId_fkey";

-- DropForeignKey
ALTER TABLE "ServicoAtendimento" DROP CONSTRAINT "ServicoAtendimento_AtendimentoId_fkey";

-- DropForeignKey
ALTER TABLE "ServicoAtendimento" DROP CONSTRAINT "ServicoAtendimento_ServicoId_fkey";

-- DropIndex
DROP INDEX "Portfolio_CabeleireiroEmail_SalaoId_key";

-- AlterTable
ALTER TABLE "AdmSalao" DROP CONSTRAINT "AdmSalao_pkey",
ADD COLUMN     "ID" TEXT NOT NULL,
ADD CONSTRAINT "AdmSalao_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "AdmSistema" ADD COLUMN     "ID" TEXT NOT NULL,
ADD CONSTRAINT "AdmSistema_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_pkey",
DROP COLUMN "CabeleireiroEmail",
DROP COLUMN "ClienteEmail",
ADD COLUMN     "AtendimentoID" TEXT,
ADD COLUMN     "CabeleireiroID" TEXT NOT NULL,
ADD COLUMN     "ClienteID" TEXT NOT NULL,
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Agendamentos_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "Agendamentos_ID_seq";

-- AlterTable
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_pkey",
DROP COLUMN "FuncionarioEmail",
ADD COLUMN     "FuncionarioID" TEXT NOT NULL,
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "Atendimento_ID_seq";

-- AlterTable
ALTER TABLE "AtendimentoAuxiliar" DROP COLUMN "AuxiliarEmail",
ADD COLUMN     "AuxiliarID" TEXT NOT NULL,
ALTER COLUMN "AtendimentoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "AuthControl" DROP CONSTRAINT "AuthControl_pkey",
ADD COLUMN     "UsuarioID" TEXT NOT NULL,
ADD CONSTRAINT "AuthControl_pkey" PRIMARY KEY ("UsuarioID");

-- AlterTable
ALTER TABLE "Cabeleireiro" DROP CONSTRAINT "Cabeleireiro_pkey",
ADD COLUMN     "ID" TEXT NOT NULL,
ADD CONSTRAINT "Cabeleireiro_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
ADD COLUMN     "ID" TEXT NOT NULL,
ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_pkey",
ADD COLUMN     "ID" TEXT NOT NULL,
ADD CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Gastos" DROP CONSTRAINT "Gastos_pkey",
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Gastos_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "Gastos_ID_seq";

-- AlterTable
ALTER TABLE "HistoricoSimulacao" DROP CONSTRAINT "HistoricoSimulacao_pkey",
DROP COLUMN "ClienteEmail",
ADD COLUMN     "ClienteID" TEXT NOT NULL,
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "HistoricoSimulacao_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "HistoricoSimulacao_ID_seq";

-- AlterTable
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_pkey",
DROP COLUMN "CabeleireiroEmail",
DROP COLUMN "FuncionarioEmail",
ADD COLUMN     "CabeleireiroID" TEXT NOT NULL,
ADD COLUMN     "FuncionarioID" TEXT NOT NULL,
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Holerite_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "Holerite_ID_seq";

-- AlterTable
ALTER TABLE "Imagem" DROP CONSTRAINT "Imagem_pkey",
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ALTER COLUMN "PortfolioId" SET DATA TYPE TEXT,
ALTER COLUMN "HistoricoSimulacaoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Imagem_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "Imagem_ID_seq";

-- AlterTable
ALTER TABLE "PagamentosAssinatura" DROP CONSTRAINT "PagamentosAssinatura_pkey",
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "PagamentosAssinatura_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "PagamentosAssinatura_ID_seq";

-- AlterTable
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_pkey",
DROP COLUMN "CabeleireiroEmail",
ADD COLUMN     "CabeleireiroID" TEXT NOT NULL,
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "Portfolio_ID_seq";

-- AlterTable
ALTER TABLE "Salao" DROP CONSTRAINT "Salao_pkey",
ADD COLUMN     "ID" TEXT NOT NULL,
ADD CONSTRAINT "Salao_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Servico" DROP CONSTRAINT "Servico_pkey",
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Servico_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "Servico_ID_seq";

-- AlterTable
ALTER TABLE "ServicoAtendimento" DROP CONSTRAINT "ServicoAtendimento_pkey",
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ALTER COLUMN "AtendimentoId" SET DATA TYPE TEXT,
ALTER COLUMN "ServicoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ServicoAtendimento_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "ServicoAtendimento_ID_seq";

-- CreateIndex
CREATE UNIQUE INDEX "AdmSalao_Email_SalaoId_key" ON "AdmSalao"("Email", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthControl_UsuarioID_key" ON "AuthControl"("UsuarioID");

-- CreateIndex
CREATE UNIQUE INDEX "AuthControl_Email_SalaoId_key" ON "AuthControl"("Email", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cabeleireiro_Email_SalaoId_key" ON "Cabeleireiro"("Email", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_Email_SalaoId_key" ON "Cliente"("Email", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_Email_SalaoId_key" ON "Funcionario"("Email", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_CabeleireiroID_key" ON "Portfolio"("CabeleireiroID");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cabeleireiro" ADD CONSTRAINT "Cabeleireiro_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmSalao" ADD CONSTRAINT "AdmSalao_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagamentosAssinatura" ADD CONSTRAINT "PagamentosAssinatura_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtendimentoAuxiliar" ADD CONSTRAINT "AtendimentoAuxiliar_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES "Atendimento"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtendimentoAuxiliar" ADD CONSTRAINT "AtendimentoAuxiliar_AuxiliarID_fkey" FOREIGN KEY ("AuxiliarID") REFERENCES "Funcionario"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_FuncionarioID_fkey" FOREIGN KEY ("FuncionarioID") REFERENCES "Funcionario"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_CabeleireiroID_fkey" FOREIGN KEY ("CabeleireiroID") REFERENCES "Cabeleireiro"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES "Cliente"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_CabeleireiroID_fkey" FOREIGN KEY ("CabeleireiroID") REFERENCES "Cabeleireiro"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_AtendimentoID_fkey" FOREIGN KEY ("AtendimentoID") REFERENCES "Atendimento"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_FuncionarioID_fkey" FOREIGN KEY ("FuncionarioID") REFERENCES "Funcionario"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_CabeleireiroID_fkey" FOREIGN KEY ("CabeleireiroID") REFERENCES "Cabeleireiro"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoAtendimento" ADD CONSTRAINT "ServicoAtendimento_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES "Atendimento"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoAtendimento" ADD CONSTRAINT "ServicoAtendimento_ServicoId_fkey" FOREIGN KEY ("ServicoId") REFERENCES "Servico"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gastos" ADD CONSTRAINT "Gastos_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoSimulacao" ADD CONSTRAINT "HistoricoSimulacao_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES "Cliente"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoSimulacao" ADD CONSTRAINT "HistoricoSimulacao_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_PortfolioId_fkey" FOREIGN KEY ("PortfolioId") REFERENCES "Portfolio"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_HistoricoSimulacaoId_fkey" FOREIGN KEY ("HistoricoSimulacaoId") REFERENCES "HistoricoSimulacao"("ID") ON DELETE SET NULL ON UPDATE CASCADE;
