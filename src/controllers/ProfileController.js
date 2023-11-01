const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

const ProfileController = {
    createProfile: async (req, res) => {
      try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
          return res.status(401).json({ message: 'Token de autorização não fornecido.' });
        }
  
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Token JWT não encontrado.' });
        }
  
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
          return res.status(401).json({ message: 'Token JWT inválido.' });
        }
  
        const { username } = decodedToken;
        const { nome, nomeMeio, ultimoNome, telefone, celular } = req.body;
        const profileAlreadyExists = await Profile.findOne({ where: { username } });
  
        if (profileAlreadyExists) {
          return res.status(400).json({ message: 'Já existe um perfil com esse username' });
        }
        
        const profile = await Profile.create({ username, nome, nomeMeio, ultimoNome, telefone, celular });
  
        return res.status(200).json(profile);
  
      } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
      }
    },

    getAllProfiles: async (req, res) => { // Somente adm
        try {
            const profiles = await Profile.findAll();
            res.status(200).json(profiles);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    deleteProfileById: async (req, res) => {  // Somente adm
        try {
            const deletedProfile = await Profile.destroy({ where: { id: req.params.id } });
            if (!deletedProfile) {
                return res.status(404).json({ error: "Perfil não encontrado" });
            }
            res.status(200).json({ message: "Perfil Excluido com Sucesso." });
        }
        catch (error) {
            res.status(401).json({ message: "Não é Possível excluir um perfil que possui usuário ativo." });
        }
    },
    getProfilebyId: async (req, res) => {
        try {
            const { id } = req.params;
            const profiles = await Profile.findOne({ where: { id: id } });
            if (!profiles) {
                return res.status(404).json({ message: "Perfil não encontrado. 🔍" });
            }
            return res.json(profiles);
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ message: error.message });
        }
    }
};

module.exports = ProfileController;