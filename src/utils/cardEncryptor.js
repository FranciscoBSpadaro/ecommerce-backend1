const crypto = require('crypto');

const encryptCardNumber = (cardNumber) => {
  // Gere uma chave segura e um IV
  const key = crypto.scryptSync('a secure password', 'salt', 32);
  const iv = crypto.randomBytes(16);

  // Criptografe o número do cartão
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let cardNumberEncrypted = cipher.update(cardNumber, 'utf8', 'hex');
  cardNumberEncrypted += cipher.final('hex');

  // Salve os últimos 4 dígitos do número do cartão
  const cardLastFourDigits = cardNumber.slice(-4);

  return { cardNumberEncrypted, cardLastFourDigits };
};

const decryptCardNumber = (cardNumberEncrypted) => {
  // Use a mesma chave e IV que foram usados para criptografar o número do cartão
  const key = crypto.scryptSync('a secure password', 'salt', 32);
  const iv = crypto.randomBytes(16);

  // Descriptografe o número do cartão
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let cardNumber = decipher.update(cardNumberEncrypted, 'hex', 'utf8');
  cardNumber += decipher.final('utf8');

  return cardNumber;
};

module.exports = {
  encryptCardNumber,
  decryptCardNumber,
};