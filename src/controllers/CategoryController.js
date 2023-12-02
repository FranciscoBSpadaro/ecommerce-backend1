const Category = require('../models/Category');

 //Este módulo contém funções para criação, leitura, atualização e exclusão de categorias.
 
const createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'O nome da categoria é obrigatório' });
    }

    const existingCategory = await Category.findOne({ where: { categoryName } });

    if (existingCategory) {
      return res.status(409).json({ message: 'A categoria já existe' });
    }

    const category = await Category.create({ categoryName, description });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    let errorMessage = 'Erro ao criar categoria';
    if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors[0].message;
    }
    res.status(500).json({ message: errorMessage });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar categorias' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id }  = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar categoria' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.update({ description });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    let errorMessage = 'Erro ao atualizar categoria';
    if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors[0].message;
    }
    res.status(400).json({ message: errorMessage });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.destroy();

    console.log(`Atenção a Categoria ID "${req.params.id}" Foi Excluida.`)

    res.status(200).json({ message: "Categoria excluída com sucesso." });
  } catch (error) {
    console.error(error);
    let errorMessage = 'Não foi possível excluir a categoria';
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      errorMessage = 'Não foi possível excluir a categoria, verifique se existem produtos atribuídos a ela.';
    }
    res.status(400).json({ message: errorMessage });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
