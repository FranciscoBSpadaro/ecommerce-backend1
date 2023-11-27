const Profile = require('../models/Profile');


module.exports = {
  createProfile: async (req, res) => {
    try {
      const { id } = req.decodedToken; // checkBearerToken in routes.use
      const { nome, nomeMeio, ultimoNome, telefone, celular } = req.body;
      const profileAlreadyExists = await Profile.findOne({ where: { userId: id } });

      if (profileAlreadyExists) {
        return res.status(400).json({ message: 'A profile with this id already exists.' });
      }

      const profile = await Profile.create({ userId: id, nome, nomeMeio, ultimoNome, telefone, celular });
      return res.status(200).json(profile);

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  },

  // front-end needs to know the profile by id
  getProfileById: async (req, res) => {
    try {
      const { id } = req.decodedToken;
      const profile = await Profile.findOne({ where: { userId: id } });

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }
      return res.status(200).json(profile);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  },

  updateProfileById: async (req, res) => {
    try {
      const { id } = req.decodedToken;
      const { nome, nomeMeio, ultimoNome, telefone, celular } = req.body;

      const existingProfile = await Profile.findOne({ where: { userId: id } });

      if (!existingProfile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      existingProfile.nome = nome || existingProfile.nome;
      existingProfile.nomeMeio = nomeMeio || existingProfile.nomeMeio;
      existingProfile.ultimoNome = ultimoNome || existingProfile.ultimoNome;
      existingProfile.telefone = telefone || existingProfile.telefone;
      existingProfile.celular = celular || existingProfile.celular;

      const updatedProfile = await existingProfile.save();
      return res.status(200).json(updatedProfile);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Formato do nome inválido' });
    }
  },
  // Routes below  for (only admins or mods can perform this action)
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await Profile.findAll();
      return res.status(200).json(profiles);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  },

  deleteProfileByUsername: async (req, res) => {
    try {
      const { username } = req.body;
      const deletedProfile = await Profile.destroy({ where: { username } });

      if (!deletedProfile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }
      return res.status(200).json({ message: 'Profile successfully deleted.' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  }
};
