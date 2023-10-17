const bcrypt = require('bcrypt');

module.exports = {
  async hashPassword(password) {                      // criptografar a senha no banco de dados
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },

  async comparePasswords(password, hashedPassword) {    // esse metodo será util para realizaçao de login.
    return bcrypt.compare(password, hashedPassword);
  }
};