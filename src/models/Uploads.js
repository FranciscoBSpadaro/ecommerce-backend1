const Sequelize = require('sequelize');
const aws = require('aws-sdk');
const fs = require('fs').promises;

const s3 = new aws.S3();

const db = require('../config/database');

const Uploads = db.define('Uploads', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
  name: {
    type: Sequelize.STRING
  },
  size: {
    type: Sequelize.INTEGER
  },
  key: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING(255)
  }

});


Uploads.beforeDestroy(async (upload) => {
  if (process.env.STORAGE_TYPE === 's3') {  // se o storage type for s3 vai deletar do bucket s3
    try {
      await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: upload.key
      }).promise();
    } catch (error) {
      console.error(error);
    }
  } 
});

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Uploads Criada com sucesso! ✔');
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de Uploads:', error);
    });


module.exports = Uploads;
