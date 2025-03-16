-- CreateTable
CREATE TABLE "AtendimentoAuxiliar" (
    "AtendimentoId" INTEGER NOT NULL,
    "AuxiliarCPF" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Atendimento" (
    "ID" SERIAL NOT NULL,
    "Data" TIMESTAMP(3) NOT NULL,
    "PrecoTotal" DOUBLE PRECISION NOT NULL,
    "FuncionarioCPF" TEXT NOT NULL,
    "Auxiliar" BOOLEAN NOT NULL,
    "SalaoId" TEXT NOT NULL,

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "AtendimentoAuxiliar_AtendimentoId_key" ON "AtendimentoAuxiliar"("AtendimentoId");

-- AddForeignKey
ALTER TABLE "AtendimentoAuxiliar" ADD CONSTRAINT "AtendimentoAuxiliar_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES "Atendimento"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtendimentoAuxiliar" ADD CONSTRAINT "AtendimentoAuxiliar_AuxiliarCPF_fkey" FOREIGN KEY ("AuxiliarCPF") REFERENCES "Funcionario"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_FuncionarioCPF_fkey" FOREIGN KEY ("FuncionarioCPF") REFERENCES "Funcionario"("CPF") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;
