### Projeto de Ecommerce Backend com Node.js, Banco de Dados SQL.
#### work in progress , quem quiser fazer o código junto pode fazer pull request

- O Objetivo é criar uma API para um projeto de ecommerce utilizando Node.js como linguagem de programação, um banco de dados SQL para armazenar os dados e alguns módulos como o Express, Sequelize, MySQL2 e Bcrypt.
1. Setup do Ambiente
Antes de iniciar o desenvolvimento do projeto, é necessário configurar o ambiente de desenvolvimento. 
- Siga os passos abaixo:
  - Certifique-se de ter o Node.js instalado em sua máquina. Você pode verificar executando o comando node -v no terminal ou prompt de comando.
  - Instale o gerenciador de pacotes NPM ou Yarn, se ainda não o tiver instalado. Execute npm -v ou yarn -v para verificar.
  - Crie um diretório para o projeto do ecommerce em seu computador. Acesse o diretório através do terminal ou prompt de comando.
  - Inicialize o projeto Node.js executando o comando npm init ou yarn init. Siga as instruções do assistente para criar o arquivo package.json, que contém as informações sobre o projeto.
2. Instalando os Módulos Necessários
Para criar o backend do projeto de ecommerce, é necessário instalar alguns módulos. 
- Execute os seguintes comandos no terminal ou prompt de comando, dentro do diretório do projeto:
  - npm install express sequelize mysql2 bcrypt
  - Este comando instalará os módulos Express, Sequelize, MySQL2 e Bcrypt, que são utilizados para criar um servidor web, realizar operações no banco de dados SQL autenticação de usuários e encriptação de senhas, respectivamente.
3. Ter um servidor mysql configurado para realizar os testes.


- Rotas para testes
- get: localhost:3000/users
  -  retorna todos usuários cadastrados no banco de dados 
- get: localhost:3000/users/1
  - retorna o usuário de id  ' 1 ' 
- post : localhost:3000/users
  - post no formato json, preencher os dados igual abaixo e fazer o request:
  ```
  {
    "username": "teste",
    "email": "jxohn.doe2@example.com",
    "password": "pasx2sword123"
  }
  ```
  
- delete: localhost:3000/users/1  
  - deleta o usuario exemplo id ' 1' 
- put : localhost:3000/users/1     
  - atualiza os dados do usuário id ' 1 '   
  ```
  {
    "username": "teste2",
    "email": "test2@example.com",
    "password": "1pasx2sword123"
  }
  ```

- todos os detalhes do desenvolvimento vai ficar no meu blog para evitar ter aqui um readme muito grande.
- https://fbs-blog.netlify.app/projeto-de-ecommerce-backend-com-node-js-banco-de-dados-sql/