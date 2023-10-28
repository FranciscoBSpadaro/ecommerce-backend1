const Profile = require('../models/Profile');

const ProfileController = {
    updateProfilebyId: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, nomeMeio, ultimoNome, telefone, celular } = req.body;
            const updateProfile = await Profile.update(
                { nome, nomeMeio, ultimoNome, telefone, celular },
                { where: { id: id } }
            );
            if (updateProfile[0] === 0) {
                return res.status(404).json({ message: 'Perfil não encontrado. 🔍' });
            }
            res.status(200).json({ message: '🤖 Perfil Alterado com Sucesso. 🤖' });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
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