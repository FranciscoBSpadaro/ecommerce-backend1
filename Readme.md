### Projeto de E-commerce Backend com Node.js, Banco de Dados SQL.
#### Work in progress

- O Objetivo é criar uma API para um projeto de e-commerce utilizando Node.js, MySQL para armazenar os dados e alguns módulos como o Express, Sequelize, MySQL2 e Bcrypt, JsonWebtoken , AWS-SDK.
1. Setup do Ambiente
Antes de iniciar o desenvolvimento do projeto, é necessário configurar o ambiente de desenvolvimento. 
- Siga os passos abaixo:
  - Certifique-se de ter o Node.js instalado em seu pc. Você pode verificar executando o comando node -v no terminal ou prompt de comando.
  - Instale o gerenciador de pacotes NPM ou Yarn, se ainda não o tiver instalado. Execute npm -v ou yarn -v para verificar.
  - Inicialize o projeto Node.js executando o comando npm run start ou npm run dev que vai carregar o nodemon para o agilizar o desenvolvimento do código
1. Instalando os Módulos Necessários
- Para criar o backend do projeto de ecommerce, é necessário instalar alguns módulos. 
  - Execute os seguintes comandos no terminal ou prompt de comando, dentro do diretório do projeto:
  - npm install
  - Este comando instalará os módulos Express, Sequelize, MySQL2 e Bcrypt, que são utilizados para criar um servidor web, realizar operações no banco de dados SQL autenticação de usuários e encriptação de senhas, respectivamente.
1. Ter um servidor mysql configurado para realizar os testes.
2.  Adicione o arquivo ' .env ' com as variáveis de Ambiente para acesso ao Mysql Server.
```
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=admin
DB_HOST=127.0.0.1
DB_DIALECT=mysql
JWT_SECRET=suaSenhaSuperSecretx01
JWT_TIME=1h
NODE_ENV=development
ADM_PASS=admin
ADM_NAME=admin
ADM_EMAIL=admin@example.com
APP_URL=http://localhost:3000
STORAGE_TYPE=local
BUCKET_NAME=nomedoseubucket
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
EMAIL_SENDER='seu-email-de-envio'
```
- Observações : 
  - NODE_ENV=production : para ambiente de produção.
  - Altere ADM_PASS,NAME,EMAIL, DB_NAME,USER,PASSWORD,HOST, como preferir.
  - STORAGE_TYPE=S3 : para ambiente de produção para uso do bucket s3.
  - APP_URL : deve ser alterado em produção para URL , exemplo, http...us-east-1.elasticbeanstalk.com
  - Crie um novo Usuário na sua conta aws apenas para ter acesso a Amazon S3 FullAccess e SES FullAccess e crie as credenciais  como chaves de chamadas de api.


- Rotas para testes
  - Disponibilizado as rotas no arquivo Routes-isomnia na raiz do projeto,  basta importar para seu insomnia e testar as rotas criadas até o moment

- Para adicionar o `jsonwebtoken` em uma requisição POST no Insomnia, você precisa seguir os seguintes passos:

1. Abra o Insomnia e selecione a requisição POST que deseja adicionar o `jsonwebtoken`.
2. Clique na aba "Headers" na parte inferior da tela.
3. Clique no botão "Add Header".
4. No campo "Header Name", digite "Authorization".
5. No campo "Header Value", digite "Bearer [seu_token_jwt_aqui]".
6. Clique em "Save" para salvar as alterações.

Certifique-se de substituir "[seu_token_jwt_aqui]" pelo seu token JWT válido. Com isso, o `jsonwebtoken` será adicionado à sua requisição POST no Insomnia.

 - Quando é requisitado a rota de login o console.log vai exibir a hash do token que pode ser copiado e adicionado ao HEADER
  -  JWT_TIME=1h  1 hora é o tempo que o token expira nesse exemplo.
  -  JWT_SECRET=   é uma senha para JWToken fazer a hash do token de login

- Diagrama de Entidade e Relacionamento.
![image](https://github.com/FranciscoBSpadaro/ecommerce-backend1/assets/69543568/4f19d1f1-3c7e-4b8e-bf86-a378581b7fcd)

- Todos os detalhes do desenvolvimento vai ficar no meu [Blog](https://fbs-blog.netlify.app/projeto-de-ecommerce-backend-com-node-js-banco-de-dados-sql/ "FBS-DEV BLOG") para evitar ter aqui um readme muito grande.
- Acompanhe o historico de commits para entender a evolução do codigo. 

 [Front-end Repo](https://github.com/FranciscoBSpadaro/ecommerce-frontend1 "work in progress")


