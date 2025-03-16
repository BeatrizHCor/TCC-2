/*
  Warnings:

  - A unique constraint covering the columns `[Mei]` on the table `Cabeleireiro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('Agendado');

-- CreateTable
CREATE TABLE "Servico" (
    "ID" SERIAL NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "PrecoMin" DOUBLE PRECISION NOT NULL,
    "PrecoMax" DOUBLE PRECISION NOT NULL,
    "Descricao" TEXT NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "ID" SERIAL NOT NULL,
    "CabeleireiroCPF" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "Descricao" TEXT NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Agendamentos" (
    "ID" SERIAL NOT NULL,
    "Data" TIMESTAMP(3) NOT NULL,
    "Status" "StatusAgendamento" NOT NULL,
    "ClienteCPF" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "CabeleireiroCPF" TEXT NOT NULL,

    CONSTRAINT "Agendamentos_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Holerite" (
    "ID" SERIAL NOT NULL,
    "Data" TIMESTAMP(3) NOT NULL,
    "Valor" DOUBLE PRECISION NOT NULL,
    "FuncionarioCPF" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "CabeleireiroCPF" TEXT NOT NULL,

    CONSTRAINT "Holerite_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ServicoAtendimento" (
    "ID" SERIAL NOT NULL,
    "PrecoItem" DOUBLE PRECISION NOT NULL,
    "AtendimentoId" INTEGER NOT NULL,
    "ServicoId" INTEGER NOT NULL,

    CONSTRAINT "ServicoAtendimento_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Gastos" (
    "ID" SERIAL NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Valor" DOUBLE PRECISION NOT NULL,
    "Descricao" TEXT NOT NULL,
    "Data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gastos_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "HistoricoSimulacao" (
    "ID" SERIAL NOT NULL,
    "Data" TIMESTAMP(3) NOT NULL,
    "ClienteCPF" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,

    CONSTRAINT "HistoricoSimulacao_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Imagem" (
    "ID" SERIAL NOT NULL,
    "PortfolioId" INTEGER NOT NULL,
    "HistoricoSimulacaoId" INTEGER,
    "Endereco" TEXT NOT NULL,
    "Descricao" TEXT NOT NULL,

    CONSTRAINT "Imagem_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_CabeleireiroCPF_key" ON "Portfolio"("CabeleireiroCPF");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_SalaoId_key" ON "Portfolio"("SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cabeleireiro_Mei_key" ON "Cabeleireiro"("Mei");

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_CabeleireiroCPF_fkey" FOREIGN KEY ("CabeleireiroCPF") REFERENCES "Cabeleireiro"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_ClienteCPF_fkey" FOREIGN KEY ("ClienteCPF") REFERENCES "Cliente"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_CabeleireiroCPF_fkey" FOREIGN KEY ("CabeleireiroCPF") REFERENCES "Cabeleireiro"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_FuncionarioCPF_fkey" FOREIGN KEY ("FuncionarioCPF") REFERENCES "Funcionario"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holerite" ADD CONSTRAINT "Holerite_CabeleireiroCPF_fkey" FOREIGN KEY ("CabeleireiroCPF") REFERENCES "Cabeleireiro"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoAtendimento" ADD CONSTRAINT "ServicoAtendimento_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES "Atendimento"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoAtendimento" ADD CONSTRAINT "ServicoAtendimento_ServicoId_fkey" FOREIGN KEY ("ServicoId") REFERENCES "Servico"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gastos" ADD CONSTRAINT "Gastos_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoSimulacao" ADD CONSTRAINT "HistoricoSimulacao_ClienteCPF_fkey" FOREIGN KEY ("ClienteCPF") REFERENCES "Cliente"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoSimulacao" ADD CONSTRAINT "HistoricoSimulacao_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_PortfolioId_fkey" FOREIGN KEY ("PortfolioId") REFERENCES "Portfolio"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_HistoricoSimulacaoId_fkey" FOREIGN KEY ("HistoricoSimulacaoId") REFERENCES "HistoricoSimulacao"("ID") ON DELETE SET NULL ON UPDATE CASCADE;
