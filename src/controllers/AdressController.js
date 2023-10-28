const Address = require('../models/Address');
const { validationResult } = require('express-validator');

// Função para criar um novo endereço
exports.createAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, street, city, state, zipCode } = req.body;

    const address = await Address.create({
      userId,
      street,
      city,
      state,
      zipCode,
    });

    return res.status(201).json({ message: 'Endereço criado com sucesso', address });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar endereço' });
  }
};

// Função para listar todos os endereços de um usuário
exports.getAddressesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addresses = await Address.findAll({
      where: { userId },
    });

    return res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar endereços' });
  }
};

// Função para atualizar um endereço
exports.updateAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, street, city, state, zipCode } = req.body;
    const addressId = req.params.id;

    const address = await Address.findByPk(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Endereço não encontrado' });
    }

    await address.update({
      userId,
      street,
      city,
      state,
      zipCode,
    });

    return res.status(200).json({ message: 'Endereço atualizado com sucesso', address });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar endereço' });
  }
};

// Função para excluir um endereço
exports.deleteAddress = async (req, res) => {
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
};
