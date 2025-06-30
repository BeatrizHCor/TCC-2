# Sistema Cololhama para salões de beleza

## Requisitos prévios
Para este programa é necessário instalação de:
- Node.js versão 22.14.0 ou superior.
- NPM versão 10.9.2 ou superior.
- Python versão 3.10.4 ou superior.
- Pycharm versão 2025.1.2 ou superior.
- PostgreSQL versão 16 ou superior.
- Criar um novo banco de dados com o nome desejado (recomendamos Cololhama, que é nome da aplicação) para salvar os dados.

## Sobre o Sistema
Este projeto foi desenvolvido em serviços diferentes que exigem a instalação apropriada de bibliotecas para cada módulo, bem como criação de arquivos para variavéis de ambiente para excecução.
Para rodar a aplicação, é necessário clonar este repositório.
- Para a instalação e excecução do serviço de inteligência artificial, favor seguir o README.md na pasta IA-COLOLHAMA com suas especificações.
- Para os serviços de AuthBackend, CabeleireiroBackend, ClienteBackend ,funcionarioBackend, ImagBackend, todas as pastas devem ser acessadas por terminal e é necessário seguir os seguintes passos:
  * Criar um arquivo com o nome .env com as variavéis:
    * PORT : Porta onde o serviço irá rodar, único para cada processo.
    * DATABASE_URL : URL apontando para o serviço do Banco de dados, seguindo o padrão "postgresql://<Nome de Usuário>:<Senha de acesso>@<Endereço de IP>:<Porta do serviço>/<Nome do Banco de dados definido no último passo dos Requisitos Prévios>?schema=public
    * SALT : Apenas para o serviço de autenticação (AuthBackend), valor aleatório para criptografia de senhas e dados.
    * CABELEREIRO_URL : URL apontando para onde serviço de Cabeleireiro (CabeleireiroBackend) irá rodar, necessário em todos os serviços menos de cabeleireiro.
    * CUSTOMER_URL: URL apontando para onde serviço de Cliente (ClientBackend) irá rodar, necessário em todos os serviços menos de cliente.
    * VITE_IMAGEM_URL: URL apontando para onde serviço de Imagens (ImagBackend) irá rodar, necessário em todos os serviços menos de imagens.
    * FuncionarioURL: URL apontando para onde serviço de Funcionario (funcionarioBackend) irá rodar, necessário em todos os serviços menos de funcionario.
  * Rodar o comando npm i e aguardar a instalação dos pacotes.
  * Rodar o comando npx prisma generate e aguardar a geração.
  * Rodar o comando npx prisma db push para gerar as tabelas no banco de dados.
  * Rodar o comando npm run dev, se tudo estiver correto, uma mensagem com o valor da porta aonde o serviço está rodando irá aparecer no terminal.
- Para o serviço da APIGATEWAY:
  * 