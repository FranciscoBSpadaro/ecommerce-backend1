const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const storageTypes = {
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        const fileExtension = path.extname(file.originalname); // path.extname para obter a extensão do arquivo e garantir que somente a extensão seja mantida no novo nome do arquivo.
        const fileName = `${hash.toString("hex")}-${fileExtension}`; // tranforma uma hash hexadecimal em string e adiciona a extensão da imagem , ex : hex.jpg
        cb(null, fileName);
      });
    },
  }),
};

const multerConfig = {
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 1024 * 1024 * 8, // 8MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/bmp",
      "image/gif",
      "image/jfif",
      "image/webp",
      "image/svg+xml",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // if allowedMimes 200 ok
    } else {
      cb(new Error("Formato de arquivo inválido.")); // verificação de erros nas funções de callback do crypto.randomBytes
    }
  },
};

module.exports = multerConfig;
