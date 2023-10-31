const Sequelize = require('sequelize');
const aws = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');

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
    type: Sequelize.STRING(255),
    primaryKey: true,
        unique: true
  }

});

Uploads.beforeSave(async (upload) => {
  if (!upload.url) {
    try {
      upload.url = `${process.env.APP_URL}/files/${upload.key}`;
      await upload.save();
    } catch (error) {
      console.error(error);
    }
  }
});

Uploads.beforeDestroy(async (upload) => {
  if (process.env.STORAGE_TYPE === 's3') {  // se o storage type for s3 vai deletar do bucket s3 , se nao vai remover do storage_type=local
    try {
      await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: upload.key
      }).promise();
    } catch (error) {
      console.error(error);
    }
  } else {
    try {  // se for desenvolviemento local deleta o arquivo localmente
      await fs.unlink(
        path.resolve(__dirname, '..', '..', 'tmp', 'uploads', upload.key)
      );
    } catch (error) {
      console.error(error);
    }
  }
});

module.exports = Uploads;
