# Cololhama - Sistema Integrado para Gestão de Salões de Beleza

## Sobre o Projeto

**Desenvolvedoras:**
- Anita Santos Teixeira
- Beatriz Helena Pinto Coradi
- Giulia Mariane Brancalhão

**Orientadora:** Profa. Dra. Rafaela Mantovani Fontana

### O que é o Cololhama?

O Cololhama é uma solução tecnológica desenvolvida para profissionalizar, inovar e organizar a gestão de salões de beleza no Brasil. O sistema integra Inteligência Artificial a uma plataforma web completa, oferecendo funcionalidades como simulação de coloração capilar, gestão de agendamentos e cadastro de clientes.

## Inteligência Artificial

O sistema conta com uma IA que batizamos de Lhama, as instruções para seu funcionamento estão no README.md da pasta "IA-Cololhma" 

## Tecnologias Utilizadas

- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express
- **Banco de Dados:** PostgreSQL
- **Inteligência Artificial:** Python, PyTorch
- **Gerenciamento de Banco:** Prisma ORM

## Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- pgAdmin (recomendado)
- Python 3.11+ (para o módulo de IA)

## Configuração do Ambiente

Crie uma database no postgress e siga as instruções abaixo:

### 1. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz de cada serviço (Gateway, AuthBack, CabeleireiroBack, FuncionarioBack, ClienteBack, ImagBack e Front-Web/cololhama) com as seguintes configurações:

```env
VITE_SALAO_ID=1

# Configuração do Servidor
VITE_GATEWAY_URL=http://localhost:5000
AUTH_URL=http://localhost:3000
CUSTOMER_URL=http://localhost:3001
FUNC_URL=http://localhost:3002
FRONTEND_URL=http://localhost:5173
CABELEREIRO_URL=http://localhost:3005
VITE_IMAGEM_URL=http://localhost:4000
IA_URL=http://localhost:8000

# Configuração do Banco de Dados
DATABASE_URL="aqui, inserir entre as aspas seu endereço de acesso a sua DATABASE criada"

# Configuração do Prisma
PRISMA_LOG_LEVEL="info"

# Porta do Serviço (ajustar conforme o serviço)
PORT=4000
```

**Importante:** Ajuste a variável `PORT` em cada serviço conforme especificado:
- Gateway: `PORT=5000`
- AuthBack: `PORT=3000`
- CustomerBack: `PORT=3001`
- FuncBack: `PORT=3002`
- CabeleireiroBack: `PORT=3005`
- ImagBack: `PORT=4000`
- IA: `PORT=8000`

### 2. Configuração Inicial do Banco de Dados

Execute os seguintes comandos SQL no PostgreSQL para criar os dados iniciais:

#### Criar Salão:
Você pode ajustar o cadastro do salão conforme o necessário, mas lembre-se que, se alterar o ID dele, deve-se também ajustar o ID nos arquivos .env e o cadastro de Administrador com o dado correto.

```sql
INSERT INTO public."Salao" ("ID", "CNPJ", "Nome", "RazaoSocial", "CEP", "Telefone", "Complemento", "Email")
VALUES
('1', '00.000.000/0001-00', 'Beleza Total Salão', 'Beleza Total Ltda.', '80000-000', '4133334444', 'Sala 101', 'contato@belezatotal.com');
```

#### Criar Administrador do Salão:
Você pode ajustar o Administrador conforme o necessário, desde que o ID do salão esteja de acordo com o salão cadastrado

```sql
INSERT INTO public."AdmSalao" ("ID", "CPF", "Nome", "Email", "Telefone", "SalaoId")
VALUES
('ADM001', '123.456.789-00', 'Administrador Salao', 'salao.adm@example.com', '(41) 99876-5432', '1');
```

### 3. Cadastro do Usuário Administrador

Após cadastrar no banco, deve-se fazer seu cadastro autenticado. Por favor, utilizar o mesmo email que usou para cadastrar no banco. 

Utilize o Postman ou similar para fazer uma requisição POST para `http://localhost:5000/register` com o seguinte conteúdo:

```json
{
  "Email": "salao.adm@example.com",
  "SalaoId": "1",
  "Password": "123",
  "userID": "ADM001",
  "userType": "AdmSalao"
}
```

## Como Utilizar o Sistema

Após concluir a configuração:

1. **Inicie todos os serviços** (Gateway, AuthBack, demais backends e frontend): `npm run dev` 
2. **Acesse o sistema** através do frontend em `http://localhost:5173`
3. **Faça login** com as credenciais do administrador cadastrado:
   - Email: `salao.adm@example.com`
   - Senha: `123`
4. **Utilize o sistema** para gerenciar agendamentos, clientes, funcionários e aproveitar as funcionalidades de IA para simulação de coloração capilar

## Arquitetura do Sistema

O Cololhama utiliza uma arquitetura de microsserviços, com:
- **Gateway:** Roteamento e centralização das requisições
- **AuthBack:** Autenticação e autorização
- **Serviços especializados:** Gestão de clientes, funcionários, cabeleireiros
- **Módulo de IA:** Processamento de imagens e simulação de coloração
- **Frontend:** Interface web responsiva

---

*Trabalho de Conclusão de Curso - Sistema Cololhama para Gestão de Salões de Beleza*
