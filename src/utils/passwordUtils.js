const bcrypt = require('bcrypt');

module.exports = {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },

  async comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
};