// Objeto para armazenar os endereços IP e a hora da última solicitação
const ipStore = {};

// Função para verificar se um IP pode fazer uma solicitação
const canMakeRequest = ip => {
  const lastRequestTime = ipStore[ip];
  const currentTime = Date.now();
  // Se o IP não existe no objeto ou a última solicitação foi feita há mais de 5 minutos
  if (!lastRequestTime || currentTime - lastRequestTime > 5 * 60 * 1000) {
    // Atualize a hora da última solicitação e retorne true
    ipStore[ip] = currentTime;
    return true;
  }
  // Se a última solicitação foi feita há menos de 5 minutos, retorne false
  return false;
};

// Objeto para armazenar os endereços de e-mail e a hora da última solicitação
const emailStore = {};

// Função para verificar se um e-mail pode fazer uma solicitação
const canEmailMakeRequest = email => {
  const lastRequestTime = emailStore[email];
  const currentTime = Date.now();
  // Se o e-mail não existe no objeto ou a última solicitação foi feita há mais de 5 minutos
  if (!lastRequestTime || currentTime - lastRequestTime > 5 * 60 * 1000) {
    // Atualize a hora da última solicitação e retorne true
    emailStore[email] = currentTime;
    return true;
  }
  // Se a última solicitação foi feita há menos de 5 minutos, retorne false
  return false;
};

module.exports = {
  canMakeRequest,
  canEmailMakeRequest,
};