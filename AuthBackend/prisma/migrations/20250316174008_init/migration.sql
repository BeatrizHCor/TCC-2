-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PAGO', 'PENDENTE', 'ATRASADO');

-- CreateTable
CREATE TABLE "Cabeleireiro" (
    "CPF" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "Mei" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,

    CONSTRAINT "Cabeleireiro_pkey" PRIMARY KEY ("CPF","SalaoId","Email","Mei")
);

-- CreateTable
CREATE TABLE "AdmSalao" (
    "CPF" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,

    CONSTRAINT "AdmSalao_pkey" PRIMARY KEY ("CPF","SalaoId","Email")
);

-- CreateTable
CREATE TABLE "AdmSistema" (
    "CPF" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PagamentosAssinatura" (
    "ID" SERIAL NOT NULL,
    "Data" TIMESTAMP(3) NOT NULL,
    "Valor" DOUBLE PRECISION NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "Status" "StatusPagamento" NOT NULL,

    CONSTRAINT "PagamentosAssinatura_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cabeleireiro_CPF_key" ON "Cabeleireiro"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Cabeleireiro_Email_key" ON "Cabeleireiro"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "AdmSalao_CPF_key" ON "AdmSalao"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "AdmSalao_Email_key" ON "AdmSalao"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "AdmSalao_SalaoId_key" ON "AdmSalao"("SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "AdmSistema_CPF_key" ON "AdmSistema"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "AdmSistema_Email_key" ON "AdmSistema"("Email");

-- AddForeignKey
ALTER TABLE "Cabeleireiro" ADD CONSTRAINT "Cabeleireiro_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmSalao" ADD CONSTRAINT "AdmSalao_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagamentosAssinatura" ADD CONSTRAINT "PagamentosAssinatura_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;
