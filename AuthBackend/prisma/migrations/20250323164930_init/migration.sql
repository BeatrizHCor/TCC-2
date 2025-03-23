/*
  Warnings:

  - A unique constraint covering the columns `[Email,SalaoId]` on the table `AuthControl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AuthControl_Email_SalaoId_key" ON "AuthControl"("Email", "SalaoId");
