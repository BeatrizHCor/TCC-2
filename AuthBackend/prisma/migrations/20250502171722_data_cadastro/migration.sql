/*
  Warnings:

  - Added the required column `Type` to the `AuthControl` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "userTypes" AS ENUM ('Cliente', 'Funcionario', 'Cabeleireiro', 'AdmSalao', 'AdmSistema');

-- AlterTable
ALTER TABLE "AdmSalao" ADD COLUMN     "DataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AuthControl" ADD COLUMN     "Type" "userTypes" NOT NULL;

-- AlterTable
ALTER TABLE "Cabeleireiro" ADD COLUMN     "DataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "DataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "DataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
