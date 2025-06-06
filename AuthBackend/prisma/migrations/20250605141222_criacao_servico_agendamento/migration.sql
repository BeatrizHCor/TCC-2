-- CreateTable
CREATE TABLE "ServicoAgendamento" (
    "ID" TEXT NOT NULL,
    "PrecoMin" DOUBLE PRECISION NOT NULL,
    "PrecoMax" DOUBLE PRECISION NOT NULL,
    "ServicoId" TEXT NOT NULL,
    "AgendamentosId" TEXT NOT NULL,

    CONSTRAINT "ServicoAgendamento_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServicoAgendamento_ServicoId_AgendamentosId_key" ON "ServicoAgendamento"("ServicoId", "AgendamentosId");

-- AddForeignKey
ALTER TABLE "ServicoAgendamento" ADD CONSTRAINT "ServicoAgendamento_ServicoId_fkey" FOREIGN KEY ("ServicoId") REFERENCES "Servico"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoAgendamento" ADD CONSTRAINT "ServicoAgendamento_AgendamentosId_fkey" FOREIGN KEY ("AgendamentosId") REFERENCES "Agendamentos"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
