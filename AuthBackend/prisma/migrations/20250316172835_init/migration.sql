-- CreateTable
CREATE TABLE "Salao" (
    "CNPJ" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "RazaoSocial" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "Telefone" INTEGER NOT NULL,
    "Complemento" TEXT NOT NULL,
    "Email" TEXT NOT NULL,

    CONSTRAINT "Salao_pkey" PRIMARY KEY ("CNPJ")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "CPF" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("CPF","SalaoId","Email")
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "CPF" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "SalaoId" TEXT NOT NULL,
    "Auxiliar" BOOLEAN NOT NULL,
    "Salario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("CPF","SalaoId","Email")
);

-- CreateIndex
CREATE UNIQUE INDEX "Salao_CNPJ_key" ON "Salao"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_CPF_key" ON "Cliente"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_Email_key" ON "Cliente"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_CPF_key" ON "Funcionario"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_Email_key" ON "Funcionario"("Email");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES "Salao"("CNPJ") ON DELETE RESTRICT ON UPDATE CASCADE;
