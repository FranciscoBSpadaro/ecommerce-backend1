const Address = require('../models/Address');
const { validationResult } = require('express-validator');

const AddressController = {
  async createAddress(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username } = req.decodedToken;
      const {street, city, state, zipCode } = req.body;

      const address = await Address.create({
        username,
        street,
        city,
        state,
        zipCode,
      });

      return res
        .status(201)
        .json({ message: 'Endereço criado com sucesso', address });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar endereço' });
    }
  },

  async getAddressesByUsername(req, res) {
    try {
      const { username } = req.decodedToken;
      const address = await Address.findAll({ where: { username } });

      if (!address) {
        return res.status(404).json({ message: 'address not found.' });
      }
      return res.status(200).json(address);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  },

  async updateAddress(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username } = req.decodedToken;
      const { street, city, state, zipCode } = req.body;
      const addressId = req.params.id;

      let address = await Address.findByPk(addressId);

      if (!address) {
        return res.status(404).json({ message: 'Endereço não encontrado' });
      }

      address = await address.update({
        username,
        street,
        city,
        state,
        zipCode,
      });

      return res
        .status(200)
        .json({ message: 'Endereço atualizado com sucesso', address });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar endereço' });
    }
  },

  async deleteAddress(req, res) {
    try {
      const addressId = req.params.id;
      const address = await Address.findByPk(addressId);

      if (!address) {
        return res.status(404).json({ message: 'Endereço não encontrado' });
      }

      await address.destroy();

      return res.status(200).json({ message: 'Endereço excluído com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao excluir endereço' });
    }
  },
};

module.exports = AddressController;
