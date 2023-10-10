const express = require('express');
const app = express();
const morgan = require('morgan')

// Configuração do middleware e do body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'))  // logs for http requests in terminal

const routes = require('./Routes');

// Rotas
app.use(routes);

// Configuração da porta do servidor
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});