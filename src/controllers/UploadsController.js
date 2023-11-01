const Uploads = require('../models/Uploads');


const UploadsController = {
  async getImages(req, res) {
    try {
      const posts = await Uploads.findAll();
      return res.json(posts);
    } catch (error) {
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
