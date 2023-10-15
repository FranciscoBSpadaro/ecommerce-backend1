const Category = require('../models/Category');

module.exports = {
    async createCategory(req, res) {
        try {
            const { categoryName, description } = req.body;
            if (!categoryName) {
                return res.status(400).json({ error: 'categoryName is required' });
            }
            // Verificar se a categoria já existe
            const existingCategory = await Category.findOne({ where: { categoryName } });
            if (existingCategory) {
                return res.status(409).json({ error: 'Category already exists' });
            }
            const category = await Category.create({ categoryName, description });
            res.status(201).json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while creating the category' });
        }
    },
    async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching the categories' });
        }
    },
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.status(200).json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching the category' });
        }
    },

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { description } = req.body;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            await category.update({ description });
            res.status(200).json(category);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'An error occurred while updating the category' });
        }
    },

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            await category.destroy();

            console.log(`Atenção a Categoria ID "${req.params.id}" Foi Excluida.`)
            res.status(200).json({ message: "Categoria Excluido com Sucesso." });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Não foi possivel excluir a categoria, essa categoria possui produtos atribuidos.' });
        }
    },
};