/*
  Warnings:

  - The values [Concluido] on the enum `StatusAgendamento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusAgendamento_new" AS ENUM ('Agendado', 'Confirmado', 'Finalizado', 'Cancelado');
ALTER TABLE "Agendamentos" ALTER COLUMN "Status" TYPE "StatusAgendamento_new" USING ("Status"::text::"StatusAgendamento_new");
ALTER TYPE "StatusAgendamento" RENAME TO "StatusAgendamento_old";
ALTER TYPE "StatusAgendamento_new" RENAME TO "StatusAgendamento";
DROP TYPE "StatusAgendamento_old";
COMMIT;
