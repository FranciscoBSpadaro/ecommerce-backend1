const Profile = require('../models/Profile');
const User = require('../models/User');

const ProfileController = {
    createProfile: async (req, res) => {
        try {
            const { nome, sobrenome, telefone, celular, username } = req.body;

            // Verificar se o usuário com o username já existe
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ error: 'Não existe um Cadastro de Usuário com esse username' });
            }

            // Verificar se o perfil com o mesmo username já existe
            const profileCheck = await Profile.findOne({ where: { username } });
            if (profileCheck) {
                return res.status(400).json({ error: `Já existe um perfil Criado para o Usuário ${username} ` });
            }

            // Criar um novo perfil se não existe
            const profile = await Profile.create({
                nome,
                sobrenome,
                telefone,
                celular,
                username
            });

            return res.status(201).json(profile);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: 'Erro ao criar perfil' });
        }
    },

    getAllProfiles: async (req, res) => {
        try {
            const profiles = await Profile.findAll();
            res.status(200).json(profiles);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    },
    deleteProfileById: async (req, res) => {
        try {
            const deletedProfile = await Profile.destroy({ where: { id: req.params.id } });
            if (!deletedProfile) {
                return res.status(404).json({ error: "Perfil não encontrado" });
            }
            res.status(200).json({ message: "Perfil Excluido com Sucesso." });
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    updateProfileByUsername: async (req, res) => {
        try {
            const { username } = req.params;
            const { nome, sobrenome, telefone, celular } = req.body;
            const updateProfile = await Profile.update(
                { nome, sobrenome, telefone, celular },
                { where: { username } }
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

    getProfileByUsername: async (req, res) => {
        try {
            const { username } = req.params;
            const profiles = await Profile.findOne({ where: { username: username }});
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