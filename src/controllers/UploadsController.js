const Uploads = require('../models/Uploads');
const { Op } = require('sequelize');

const UploadsController = {
  async getImages(req, res) {
    try {
      const limit = Number(req.query.limit);
      const offset = Number(req.query.offset) || 0;
      const images = await Uploads.findAll({ limit, offset });
      const hasMore = (await Uploads.count()) > offset + limit;
      return res.json({ images, hasMore });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async getImagesByName(req, res) {
    try {
      const { name } = req.query;
      const limit = Number(req.query.limit);
      const offset = Number(req.query.offset) || 0;
      const images = await Uploads.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        limit,
        offset,
      });
      if (images.length === 0) {
        return res.status(404).json({ message: 'Imagem nao localizada' });
      }
      const totalImages = await Uploads.count({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
      const hasMore = totalImages > offset + limit;
      return res.json({ images, hasMore });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  },

  async uploadImage(req, res) {
    try {
      const { originalname: name, size, key, location: url = '' } = req.file;

      const post = await Uploads.create({
        name,
        size,
        key,
        url,
      });

      return res.json(post);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  async deleteImage(req, res) {
    try {
      const id = req.params.id;
      const post = await Uploads.findByPk(id);
      if (post) {
        await post.destroy();
        return res.status(200).json('Image Deleted');
      } else {
        return res.status(404).json('Image not found');
      }
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};

module.exports = UploadsController;
