const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

if (process.env.NODE_ENV !== 'production') {
  // se ambiente for difente de produção então use o dotenv , no caso de ambiente development
  require('dotenv').config();
}

// Configuração do middleware e do body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração do CORS
app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  }),
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});

// Usando o middleware Helmet
app.use(helmet());

app.use(morgan('dev')); // logs for http requests in terminal

const routes = require('./Routes');

// Rotas
app.use(routes);

// Configuração da porta do servidor
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor online na porta ${PORT}`);
});