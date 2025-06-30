
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

- Node.js (versão 22 ou superior)
- PostgreSQL (versão 16 ou superior)
- pgAdmin (recomendado)
- Python 3.11+ (para o módulo de IA)
- NPM (versão 10.9.2 ou superior).
## Configuração do Ambiente

Crie uma database no postgress e siga as instruções abaixo:

### 1. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz de cada serviço (APIGateway, AuthBackend, CabeleireiroBackend, funcionariobackend, ClientBackend, ImagBackend e Front-Web/cololhama) com as seguintes configurações:

```env
VITE_SALAO_ID=<valor do id desejado para o salão que será criado na etapa 2>

# Configuração do Servidor
VITE_GATEWAY_URL=<URL aonde irá ser excecutado a API Gateway>
AUTH_URL=<URL aonde irá ser excecutado o serviço de autenticação>
CUSTOMER_URL=<URL aonde irá ser excecutado o serviço de clientes>
FUNC_URL=<URL aonde irá ser excecutado o serviço de funcionários>
FRONTEND_URL=<URL aonde irá ser excecutado o serviço de front-end>
CABELEREIRO_URL=<URL aonde irá ser excecutado o serviço de cabeleireiros>
VITE_IMAGEM_URL=<URL aonde irá ser excecutado o serviço de imagens>
IA_URL=<URL aonde irá ser excecutado o serviço de Inteligência Artificial>

# Configuração do Banco de Dados
DATABASE_URL= <URL padrão para configuração de conexão com o banco de dados postgreSQL, apontando para a excecução deste serviço seguinto o modelo postgresql://USER:PASSWORD@EXTERNAL_HOST:PORT/DATABASE >

# Configuração do Prisma
PRISMA_LOG_LEVEL="info"

# Porta de excecução Serviço (ajustar conforme o serviço)
PORT=
```

### 2. Configuração Inicial do Banco de Dados
#### Criar as tabelas
Excecute o arquivo createSQL.sql no seu banco de dados postgreSQL para criação de todas as tabelas. Você também pode importá-lo com o Query Tool do pgAdmin se o tiver instalado.

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

Após cadastrar no banco, deve-se fazer seu cadastro autenticado.

Utilize o Postman ou similar para fazer uma requisição POST para `<URL aonde irá ser excecutado o serviço de autenticação>/register` com o seguinte conteúdo:

```json
{
  "Email": "salao.adm@example.com",
  "SalaoId": "1",
  "Password": "123",
  "userID": "ADM001",
  "userType": "AdmSalao"
}
```
Atente-se que "SalaoId" deve refletir o id do salão cadastrado na etapa 2, assim como "Email" deve refletir o email do administrador também cadastrado na etapa 2. A Senha é um valor a escolha do usuário.

### 4. Instalações de pacotes.
#### Serviços de backend
Para os serviços de Autenticação (AuthBackend), Cabeleireiro (CabeleireiroBackend), Cliente (ClientBackend), Funcionario (funcionariobackend) e imagens (ImagBackend):
- Acessar a pasta raiz.
- Rodar o comando ```npm i ``` e esperar a instalação de todos os pacotes.
- Rodar o comando ```npx prisma generate```, aceitar a instalação de engine do prisma se necessário e esperar a geração dos arquivos.

Para os serviços de Front-end (Front-Web/cololhama) e API Gateway:
- Acessar a pasta raiz;
- Rodar o comando ```npm i ``` e esperar a instalação de todos os pacotes.

## Como Utilizar o Sistema

Após concluir a configuração:

1. **Inicie todos os serviços** (APIGateway, AuthBackend, CabeleireiroBackend, ClientBackend, Front-Web/cololhama, funcionariobackend, ImagBackend ): `npm run dev'
2. **Inicie o serviço de IA seguindo a sua documentação própria**
3. **Acesse o sistema** através do frontend acessando a url do serviço por qualquer navegador
4. **Faça login** com as credenciais do administrador cadastrado na etapa 3:
   - Email: `salao.adm@example.com`
   - Senha: `123`
5. **Utilize o sistema** para gerenciar cabeleireiros, clientes, funcionários e aproveitar as funcionalidades de IA para simulação de coloração capilar, além das outras funções.

## Arquitetura do Sistema

O Cololhama utiliza uma arquitetura de microsserviços, com:
- **Gateway:** Roteamento e centralização das requisições.
- **AuthBack:** Autenticação e autorização.
- **Serviços especializados:** Gestão de clientes, funcionários, cabeleireiros e armazenamento de imagens.
- **Módulo de IA:** Processamento de imagens e simulação de coloração.
- **Frontend:** Interface web responsiva.

---

*Trabalho de Conclusão de Curso - Sistema Cololhama para Gestão de Salões de Beleza*

