### Projeto de E-commerce Backend com Node.js, Banco de Dados SQL.
#### Work in progress , quem quiser fazer o código junto pode fazer pull request

- O Objetivo é criar uma API para um projeto de e-commerce utilizando Node.js, MySQL para armazenar os dados e alguns módulos como o Express, Sequelize, MySQL2 e Bcrypt.
1. Setup do Ambiente
Antes de iniciar o desenvolvimento do projeto, é necessário configurar o ambiente de desenvolvimento. 
- Siga os passos abaixo:
  - Certifique-se de ter o Node.js instalado em sua máquina. Você pode verificar executando o comando node -v no terminal ou prompt de comando.
  - Recomendo utilizar o terminal gitbash no vscode para executar todos os comandos sem erros
  - Instale o gerenciador de pacotes NPM ou Yarn, se ainda não o tiver instalado. Execute npm -v ou yarn -v para verificar.
  - Inicialize o projeto Node.js executando o comando npm run start ou npm run dev que vai carregar o nodemon para o agilizar o desenvolvimento do código
2. Instalando os Módulos Necessários
- Para criar o backend do projeto de ecommerce, é necessário instalar alguns módulos. 
  - Execute os seguintes comandos no terminal ou prompt de comando, dentro do diretório do projeto:
  - npm install
  - Este comando instalará os módulos Express, Sequelize, MySQL2 e Bcrypt, que são utilizados para criar um servidor web, realizar operações no banco de dados SQL autenticação de usuários e encriptação de senhas, respectivamente.
3. Ter um servidor mysql configurado para realizar os testes.
4.  Adicione o arquivo ' .env ' com as variáveis de Ambiente para acesso ao Mysql Server.
```
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=senha
DB_HOST=127.0.0.1
DB_DIALECT=mysql
```

- Rotas para testes
  - Disponibilizado as rotas no arquivo Routes-isomnia na raiz do projeto,  basta importar para seu insomnia e testar as rotas criadas até o momento

- todos os detalhes do desenvolvimento vai ficar no meu blog para evitar ter aqui um readme muito grande.
- https://fbs-blog.netlify.app/projeto-de-ecommerce-backend-com-node-js-banco-de-dados-sql/