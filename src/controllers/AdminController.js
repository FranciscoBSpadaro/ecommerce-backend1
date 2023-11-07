const User = require("../models/User");

exports.setRoles = async (req, res) => {
  try { // TOODO trocar esse id para body username
    const id = req.params.id; // obtém o id a ser atualizado usando a desestruturação do objeto req.params
    const { isAdmin, isMod } = req.body; // obtém as informações isAdmin e isMod do body da requisição usando a desestruturação do objeto req.body
    const [updatedRows] = await User.update(
      { isAdmin: isAdmin, isMod: isMod }, 
      { where: { id: id } }
    ); // faz a atualização dos dados do usuário baseado no id que é passado via parametro da rota
    if (updatedRows === 0) {
      res.status(404).json({ message: "User not found." }); // Caso não encontre o usuário, retorna um erro 404 (Not found)
    } else {
      res.status(200).json({ success: `User ID ${id}, ADM = ${isAdmin}, MOD = ${isMod}`, message: "User roles updated successfully." }); // Se a atualização foi realizada com sucesso, retorno um objeto JSON com mensagem e status de sucesso
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message }); // Se ocorrer qualquer erro, retorna um erro 401 (Unauthorized) com a mensagem do erro
  }
};