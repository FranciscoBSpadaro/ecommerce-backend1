const Address = require('../models/Address');
const { body, param, validationResult } = require('express-validator');

async function createAddress(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { street, city, state, zipCode } = req.body;

    // Fetch all addresses for the user
    const addresses = await Address.findAll({ where: { userId: id } });

    // Check if the user already has 3 addresses
    if (addresses.length >= 3) {
      return res
        .status(400)
        .json({ message: 'User cannot have more than 3 addresses' });
    }

    const address = await Address.create({
      userId: id,
      street,
      city,
      state,
      zipCode,
    });

    return res
      .status(201)
      .json({ message: 'Address created successfully', address });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while creating address' });
  }
}

async function getAddressesByUserId(req, res) {
  try {
    const { id: userId } = req.params;
    const addresses = await Address.findAll({ where: { userId: userId } });

    if (addresses.length === 0) {
      // check for empty address array
      return res.status(404).json({ message: 'Address not found' });
    }
    return res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function updateAddress(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const addressId = req.params.id
    const { street, city, state, zipCode } = req.body;

    const address = await Address.findByPk(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // only update fields that are sent in the body and not the entire object
    await address.update({
      street: street ?? address.street,
      city: city ?? address.city,
      state: state ?? address.state,
      zipCode: zipCode ?? address.zipCode,
    });

    return res
      .status(200)
      .json({ message: 'Address updated successfully', address });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while updating address' });
  }
}

async function deleteAddress(req, res) {
  try {
    const addressId = req.params.id;
    const address = await Address.findByPk(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.destroy();

    return res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while deleting address' });
  }
}

// Use express-validator to sanitize and validate incoming requests
// for example, check if zipCode and state have valid values
const validateAddress = [
  body('street').notEmpty(),
  body('city').notEmpty(),
  body('state').isAlpha(),
  body('zipCode').isPostalCode('BR'),
  param('id').isUUID(),
];

module.exports = {
  createAddress,
  getAddressesByUserId,
  updateAddress,
  deleteAddress,
  validateAddress,
};
