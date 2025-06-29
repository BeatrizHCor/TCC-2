-- CreateEnum
CREATE TYPE "StatusCadastro" AS ENUM ('ATIVO', 'DESATIVADO');

-- AlterTable
ALTER TABLE "Cabeleireiro" ADD COLUMN     "Status" "StatusCadastro" NOT NULL DEFAULT 'ATIVO';

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "Status" "StatusCadastro" NOT NULL DEFAULT 'ATIVO';

-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "Status" "StatusCadastro" NOT NULL DEFAULT 'ATIVO';
