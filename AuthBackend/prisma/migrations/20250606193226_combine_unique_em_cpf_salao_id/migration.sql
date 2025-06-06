/*
  Warnings:

  - A unique constraint covering the columns `[CPF,SalaoId]` on the table `AdmSalao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CPF,SalaoId]` on the table `Cabeleireiro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CPF,SalaoId]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CPF,SalaoId]` on the table `Funcionario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdmSalao_CPF_SalaoId_key" ON "AdmSalao"("CPF", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cabeleireiro_CPF_SalaoId_key" ON "Cabeleireiro"("CPF", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_CPF_SalaoId_key" ON "Cliente"("CPF", "SalaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_CPF_SalaoId_key" ON "Funcionario"("CPF", "SalaoId");
