const express = require('express');
const app = express();

// Configuração do middleware e do body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./Routes');

// Rotas
app.use(routes);

// Configuração da porta do servidor
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});