SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
ALTER SCHEMA public OWNER TO postgres;
COMMENT ON SCHEMA public IS '';
CREATE TYPE public."ImagemTipo" AS ENUM (
    'Analoga',
    'Analoga2',
    'Complementar',
    'Portfolio'
);
ALTER TYPE public."ImagemTipo" OWNER TO postgres;
CREATE TYPE public."StatusAgendamento" AS ENUM (
    'Agendado',
    'Confirmado',
    'Finalizado',
    'Cancelado'
);
ALTER TYPE public."StatusAgendamento" OWNER TO postgres;
CREATE TYPE public."StatusCadastro" AS ENUM (
    'ATIVO',
    'DESATIVADO'
);
ALTER TYPE public."StatusCadastro" OWNER TO postgres;
CREATE TYPE public."userTypes" AS ENUM (
    'Cliente',
    'Funcionario',
    'Cabeleireiro',
    'AdmSalao',
    'AdmSistema'
);
ALTER TYPE public."userTypes" OWNER TO postgres;
SET default_tablespace = '';
SET default_table_access_method = heap;
CREATE TABLE public."AdmSalao" (
    "ID" text NOT NULL,
    "CPF" text NOT NULL,
    "Nome" text NOT NULL,
    "Email" text NOT NULL,
    "Telefone" text NOT NULL,
    "SalaoId" text NOT NULL,
    "DataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE public."AdmSalao" OWNER TO postgres;
CREATE TABLE public."AdmSistema" (
    "ID" text NOT NULL,
    "CPF" text NOT NULL,
    "Nome" text NOT NULL,
    "Email" text NOT NULL,
    "Telefone" text NOT NULL
);
ALTER TABLE public."AdmSistema" OWNER TO postgres;
CREATE TABLE public."Agendamentos" (
    "ID" text NOT NULL,
    "Data" timestamp(3) without time zone NOT NULL,
    "Status" public."StatusAgendamento" NOT NULL,
    "ClienteID" text NOT NULL,
    "SalaoId" text NOT NULL,
    "CabeleireiroID" text NOT NULL,
    "AtendimentoID" text
);
ALTER TABLE public."Agendamentos" OWNER TO postgres;
CREATE TABLE public."Atendimento" (
    "ID" text NOT NULL,
    "Data" timestamp(3) without time zone NOT NULL,
    "PrecoTotal" double precision NOT NULL,
    "Auxiliar" boolean NOT NULL,
    "SalaoId" text NOT NULL
);
ALTER TABLE public."Atendimento" OWNER TO postgres;
CREATE TABLE public."AtendimentoAuxiliar" (
    "AtendimentoId" text NOT NULL,
    "AuxiliarID" text NOT NULL
);
ALTER TABLE public."AtendimentoAuxiliar" OWNER TO postgres;
CREATE TABLE public."AuthControl" (
    "UsuarioID" text NOT NULL,
    "Email" text NOT NULL,
    "SalaoId" text NOT NULL,
    "Senha" text NOT NULL,
    "Type" public."userTypes" NOT NULL,
    "Token" text
);
ALTER TABLE public."AuthControl" OWNER TO postgres;
CREATE TABLE public."Cabeleireiro" (
    "ID" text NOT NULL,
    "CPF" text NOT NULL,
    "Nome" text NOT NULL,
    "Email" text NOT NULL,
    "Telefone" text NOT NULL,
    "Mei" text NOT NULL,
    "SalaoId" text NOT NULL,
    "DataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Status" public."StatusCadastro" DEFAULT 'ATIVO'::public."StatusCadastro" NOT NULL
);
ALTER TABLE public."Cabeleireiro" OWNER TO postgres;
CREATE TABLE public."Cliente" (
    "ID" text NOT NULL,
    "CPF" text NOT NULL,
    "Nome" text NOT NULL,
    "Email" text NOT NULL,
    "Telefone" text NOT NULL,
    "SalaoId" text NOT NULL,
    "DataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Status" public."StatusCadastro" DEFAULT 'ATIVO'::public."StatusCadastro" NOT NULL
);
ALTER TABLE public."Cliente" OWNER TO postgres;
CREATE TABLE public."Funcionario" (
    "ID" text NOT NULL,
    "CPF" text NOT NULL,
    "Nome" text NOT NULL,
    "Email" text NOT NULL,
    "Telefone" text NOT NULL,
    "SalaoId" text NOT NULL,
    "Auxiliar" boolean NOT NULL,
    "Salario" double precision NOT NULL,
    "DataCadastro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Status" public."StatusCadastro" DEFAULT 'ATIVO'::public."StatusCadastro" NOT NULL
);
ALTER TABLE public."Funcionario" OWNER TO postgres;
CREATE TABLE public."HistoricoSimulacao" (
    "ID" text NOT NULL,
    "Data" timestamp(3) without time zone NOT NULL,
    "ClienteID" text NOT NULL,
    "SalaoId" text NOT NULL
);
ALTER TABLE public."HistoricoSimulacao" OWNER TO postgres;
CREATE TABLE public."Imagem" (
    "ID" text NOT NULL,
    "PortfolioId" text NOT NULL,
    "HistoricoSimulacaoId" text,
    "Endereco" text NOT NULL,
    "Descricao" text NOT NULL,
    "Tipo" public."ImagemTipo" DEFAULT 'Portfolio'::public."ImagemTipo" NOT NULL
);
ALTER TABLE public."Imagem" OWNER TO postgres;
CREATE TABLE public."Portfolio" (
    "ID" text NOT NULL,
    "CabeleireiroID" text NOT NULL,
    "SalaoId" text NOT NULL,
    "Descricao" text NOT NULL
);
ALTER TABLE public."Portfolio" OWNER TO postgres;
CREATE TABLE public."Salao" (
    "ID" text NOT NULL,
    "CNPJ" text NOT NULL,
    "Nome" text NOT NULL,
    "RazaoSocial" text NOT NULL,
    "CEP" text NOT NULL,
    "Telefone" integer NOT NULL,
    "Complemento" text NOT NULL,
    "Email" text NOT NULL
);
ALTER TABLE public."Salao" OWNER TO postgres;
CREATE TABLE public."Servico" (
    "ID" text NOT NULL,
    "SalaoId" text NOT NULL,
    "Nome" text NOT NULL,
    "PrecoMin" double precision NOT NULL,
    "PrecoMax" double precision NOT NULL,
    "Descricao" text NOT NULL
);
ALTER TABLE public."Servico" OWNER TO postgres;
CREATE TABLE public."ServicoAgendamento" (
    "ID" text NOT NULL,
    "Nome" text NOT NULL,
    "PrecoMin" double precision NOT NULL,
    "PrecoMax" double precision NOT NULL,
    "ServicoId" text NOT NULL,
    "AgendamentosId" text NOT NULL
);
ALTER TABLE public."ServicoAgendamento" OWNER TO postgres;
CREATE TABLE public."ServicoAtendimento" (
    "ID" text NOT NULL,
    "PrecoItem" double precision NOT NULL,
    "AtendimentoId" text NOT NULL,
    "ServicoId" text NOT NULL
);
ALTER TABLE public."ServicoAtendimento" OWNER TO postgres;
CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
ALTER TABLE public._prisma_migrations OWNER TO postgres;
ALTER TABLE ONLY public."AdmSalao"
    ADD CONSTRAINT "AdmSalao_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."AdmSistema"
    ADD CONSTRAINT "AdmSistema_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Agendamentos"
    ADD CONSTRAINT "Agendamentos_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Atendimento"
    ADD CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."AuthControl"
    ADD CONSTRAINT "AuthControl_pkey" PRIMARY KEY ("UsuarioID");
ALTER TABLE ONLY public."Cabeleireiro"
    ADD CONSTRAINT "Cabeleireiro_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Funcionario"
    ADD CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."HistoricoSimulacao"
    ADD CONSTRAINT "HistoricoSimulacao_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Imagem"
    ADD CONSTRAINT "Imagem_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Portfolio"
    ADD CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Salao"
    ADD CONSTRAINT "Salao_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."ServicoAgendamento"
    ADD CONSTRAINT "ServicoAgendamento_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."ServicoAtendimento"
    ADD CONSTRAINT "ServicoAtendimento_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public."Servico"
    ADD CONSTRAINT "Servico_pkey" PRIMARY KEY ("ID");
ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
CREATE UNIQUE INDEX "AdmSalao_CPF_SalaoId_key" ON public."AdmSalao" USING btree ("CPF", "SalaoId");
CREATE UNIQUE INDEX "AdmSalao_Email_SalaoId_key" ON public."AdmSalao" USING btree ("Email", "SalaoId");
CREATE UNIQUE INDEX "AdmSalao_SalaoId_key" ON public."AdmSalao" USING btree ("SalaoId");
CREATE UNIQUE INDEX "AdmSistema_CPF_key" ON public."AdmSistema" USING btree ("CPF");
CREATE UNIQUE INDEX "AdmSistema_Email_key" ON public."AdmSistema" USING btree ("Email");
CREATE UNIQUE INDEX "AtendimentoAuxiliar_AtendimentoId_AuxiliarID_key" ON public."AtendimentoAuxiliar" USING btree ("AtendimentoId", "AuxiliarID");
CREATE UNIQUE INDEX "AuthControl_Email_SalaoId_key" ON public."AuthControl" USING btree ("Email", "SalaoId");
CREATE UNIQUE INDEX "Cabeleireiro_CPF_SalaoId_key" ON public."Cabeleireiro" USING btree ("CPF", "SalaoId");
CREATE UNIQUE INDEX "Cabeleireiro_Email_SalaoId_key" ON public."Cabeleireiro" USING btree ("Email", "SalaoId");
CREATE UNIQUE INDEX "Cliente_CPF_SalaoId_key" ON public."Cliente" USING btree ("CPF", "SalaoId");
CREATE UNIQUE INDEX "Cliente_Email_SalaoId_key" ON public."Cliente" USING btree ("Email", "SalaoId");
CREATE UNIQUE INDEX "Funcionario_CPF_SalaoId_key" ON public."Funcionario" USING btree ("CPF", "SalaoId");
CREATE UNIQUE INDEX "Funcionario_Email_SalaoId_key" ON public."Funcionario" USING btree ("Email", "SalaoId");
CREATE UNIQUE INDEX "Portfolio_CabeleireiroID_key" ON public."Portfolio" USING btree ("CabeleireiroID");
CREATE UNIQUE INDEX "Salao_CNPJ_key" ON public."Salao" USING btree ("CNPJ");
CREATE UNIQUE INDEX "ServicoAgendamento_ServicoId_AgendamentosId_key" ON public."ServicoAgendamento" USING btree ("ServicoId", "AgendamentosId");
ALTER TABLE ONLY public."AdmSalao"
    ADD CONSTRAINT "AdmSalao_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Agendamentos"
    ADD CONSTRAINT "Agendamentos_AtendimentoID_fkey" FOREIGN KEY ("AtendimentoID") REFERENCES public."Atendimento"("ID") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public."Agendamentos"
    ADD CONSTRAINT "Agendamentos_CabeleireiroID_fkey" FOREIGN KEY ("CabeleireiroID") REFERENCES public."Cabeleireiro"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Agendamentos"
    ADD CONSTRAINT "Agendamentos_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES public."Cliente"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Agendamentos"
    ADD CONSTRAINT "Agendamentos_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."AtendimentoAuxiliar"
    ADD CONSTRAINT "AtendimentoAuxiliar_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES public."Atendimento"("ID") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."AtendimentoAuxiliar"
    ADD CONSTRAINT "AtendimentoAuxiliar_AuxiliarID_fkey" FOREIGN KEY ("AuxiliarID") REFERENCES public."Funcionario"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Atendimento"
    ADD CONSTRAINT "Atendimento_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Cabeleireiro"
    ADD CONSTRAINT "Cabeleireiro_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Funcionario"
    ADD CONSTRAINT "Funcionario_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."HistoricoSimulacao"
    ADD CONSTRAINT "HistoricoSimulacao_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES public."Cliente"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."HistoricoSimulacao"
    ADD CONSTRAINT "HistoricoSimulacao_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Imagem"
    ADD CONSTRAINT "Imagem_HistoricoSimulacaoId_fkey" FOREIGN KEY ("HistoricoSimulacaoId") REFERENCES public."HistoricoSimulacao"("ID") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Imagem"
    ADD CONSTRAINT "Imagem_PortfolioId_fkey" FOREIGN KEY ("PortfolioId") REFERENCES public."Portfolio"("ID") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Portfolio"
    ADD CONSTRAINT "Portfolio_CabeleireiroID_fkey" FOREIGN KEY ("CabeleireiroID") REFERENCES public."Cabeleireiro"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Portfolio"
    ADD CONSTRAINT "Portfolio_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."ServicoAgendamento"
    ADD CONSTRAINT "ServicoAgendamento_AgendamentosId_fkey" FOREIGN KEY ("AgendamentosId") REFERENCES public."Agendamentos"("ID") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."ServicoAgendamento"
    ADD CONSTRAINT "ServicoAgendamento_ServicoId_fkey" FOREIGN KEY ("ServicoId") REFERENCES public."Servico"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."ServicoAtendimento"
    ADD CONSTRAINT "ServicoAtendimento_AtendimentoId_fkey" FOREIGN KEY ("AtendimentoId") REFERENCES public."Atendimento"("ID") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."ServicoAtendimento"
    ADD CONSTRAINT "ServicoAtendimento_ServicoId_fkey" FOREIGN KEY ("ServicoId") REFERENCES public."Servico"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Servico"
    ADD CONSTRAINT "Servico_SalaoId_fkey" FOREIGN KEY ("SalaoId") REFERENCES public."Salao"("ID") ON UPDATE CASCADE ON DELETE RESTRICT;
REVOKE USAGE ON SCHEMA public FROM PUBLIC;
