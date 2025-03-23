/*
  Warnings:

  - The primary key for the `AdmSalao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Senha` on the `AdmSalao` table. All the data in the column will be lost.
  - You are about to drop the column `Senha` on the `AdmSistema` table. All the data in the column will be lost.
  - You are about to drop the column `CabeleireiroCPF` on the `Agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `ClienteCPF` on the `Agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `FuncionarioCPF` on the `Atendimento` table. All the data in the column will be lost.
  - You are about to drop the column `AuxiliarCPF` on the `AtendimentoAuxiliar` table. All the data in the column will be lost.
  - The primary key for the `Cabeleireiro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Senha` on the `Cabeleireiro` table. All the data in the column will be lost.
  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Senha` on the `Cliente` table. All the data in the column will be lost.
  - The primary key for the `Funcionario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Senha` on the `Funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `ClienteCPF` on the `HistoricoSimulacao` table. All the data in the column will be lost.
  - You are about to drop the column `CabeleireiroCPF` on the `Holerite` table. All the data in the column will be lost.
  - You are about to drop the column `FuncionarioCPF` on the `Holerite` table. All the data in the column will be lost.
  - You are about to drop the column `CabeleireiroCPF` on the `Portfolio` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CabeleireiroEmail,SalaoId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CabeleireiroEmail` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ClienteEmail` to the `Agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FuncionarioEmail` to the `Atendimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AuxiliarEmail` to the `AtendimentoAuxiliar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SalaoId` to the `AtendimentoAuxiliar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ClienteEmail` to the `HistoricoSimulacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CabeleireiroEmail` to the `Holerite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FuncionarioEmail` to the `Holerite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CabeleireiroEmail` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_CabeleireiroCPF_fkey";

-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_ClienteCPF_fkey";

-- DropForeignKey
ALTER TABLE "Atendimento" DROP CONSTRAINT "Atendimento_FuncionarioCPF_fkey";

-- DropForeignKey
ALTER TABLE "AtendimentoAuxiliar" DROP CONSTRAINT "AtendimentoAuxiliar_AuxiliarCPF_fkey";

-- DropForeignKey
ALTER TABLE "HistoricoSimulacao" DROP CONSTRAINT "HistoricoSimulacao_ClienteCPF_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_CabeleireiroCPF_fkey";

-- DropForeignKey
ALTER TABLE "Holerite" DROP CONSTRAINT "Holerite_FuncionarioCPF_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_CabeleireiroCPF_fkey";

-- DropIndex
DROP INDEX "AdmSalao_CPF_key";

-- DropIndex
DROP INDEX "AdmSalao_Email_key";

-- DropIndex
DROP INDEX "Cabeleireiro_CPF_key";

-- DropIndex
DROP INDEX "Cabeleireiro_Email_key";

-- DropIndex
DROP INDEX "Cabeleireiro_Mei_key";

-- DropIndex
DROP INDEX "Cliente_CPF_key";

-- DropIndex
DROP INDEX "Cliente_Email_key";

-- DropIndex
DROP INDEX "Funcionario_CPF_key";

-- DropIndex
DROP INDEX "Funcionario_Email_key";

-- DropIndex
DROP INDEX "Portfolio_CabeleireiroCPF_key";

-- DropIndex
DROP INDEX "Portfolio_SalaoId_key";

-- AlterTable
ALTER TABLE "AdmSalao" DROP CONSTRAINT "AdmSalao_pkey",
DROP COLUMN "Senha",
ADD CONSTRAINT "AdmSalao_pkey" PRIMARY KEY ("Email", "SalaoId");

-- AlterTable
ALTER TABLE "AdmSistema" DROP COLUMN "Senha";

-- AlterTable
ALTER TABLE "Agendamentos" DROP COLUMN "CabeleireiroCPF",
DROP COLUMN "ClienteCPF",
ADD COLUMN     "CabeleireiroEmail" TEXT NOT NULL,
ADD COLUMN     "ClienteEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Atendimento" DROP COLUMN "FuncionarioCPF",
ADD COLUMN     "FuncionarioEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AtendimentoAuxiliar" DROP COLUMN "AuxiliarCPF",
ADD COLUMN     "AuxiliarEmail" TEXT NOT NULL,
ADD COLUMN     "SalaoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cabeleireiro" DROP CONSTRAINT "Cabeleireiro_pkey",
DROP COLUMN "Senha",
ADD CONSTRAINT "Cabeleireiro_pkey" PRIMARY KEY ("Email", "SalaoId");

-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
DROP COLUMN "Senha",
ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("Email", "SalaoId");

-- AlterTable
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_pkey",
DROP COLUMN "Senha",
ADD CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("Email", "SalaoId");

-- AlterTable
ALTER TABLE "HistoricoSimulacao" DROP COLUMN "ClienteCPF",
ADD COLUMN     "ClienteEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Holerite" DROP COLUMN "CabeleireiroCPF",
DROP COLUMN "FuncionarioCPF",
ADD COLUMN     "CabeleireiroEmail" TEXT NOT NULL,
ADD COLUMN     "FuncionarioEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "CabeleireiroCPF",
ADD COLUMN     "CabeleireiroEmail" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AuthControl" (
    "Email" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "Token" TEXT NOT NULL,

    CONSTRAINT "AuthControl_pkey" PRIMARY KEY ("Email","SalaoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_CabeleireiroEmail_SalaoId_key" ON "Portfolio"("CabeleireiroEmail", "SalaoId");

-- AddForeignKey
ALTER TABLE "AtendimentoAuxiliar" ADD CONSTRAINT "AtendimentoAuxiliar_AuxiliarEmail_SalaoId_fkey" FOREIGN KEY ("AuxiliarEmail", "SalaoId") REFERENCES "Funcionario"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_FuncionarioEmail_SalaoId_fkey" FOREIGN KEY ("FuncionarioEmail", "SalaoId") REFERENCES "Funcionario"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_CabeleireiroEmail_SalaoId_fkey" FOREIGN KEY ("CabeleireiroEmail", "SalaoId") REFERENCES "Cabeleireiro"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_ClienteEmail_SalaoId_fkey" FOREIGN KEY ("ClienteEmail", "SalaoId") REFERENCES "Cliente"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_CabeleireiroEmail_SalaoId_fkey" FOREIGN KEY ("CabeleireiroEmail", "SalaoId") REFERENCES "Cabeleireiro"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_FuncionarioEmail_SalaoId_fkey" FOREIGN KEY ("FuncionarioEmail", "SalaoId") REFERENCES "Funcionario"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_CabeleireiroEmail_SalaoId_fkey" FOREIGN KEY ("CabeleireiroEmail", "SalaoId") REFERENCES "Cabeleireiro"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoSimulacao" ADD CONSTRAINT "HistoricoSimulacao_ClienteEmail_SalaoId_fkey" FOREIGN KEY ("ClienteEmail", "SalaoId") REFERENCES "Cliente"("Email", "SalaoId") ON DELETE RESTRICT ON UPDATE CASCADE;
