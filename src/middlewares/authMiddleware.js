const jwt = require('jsonwebtoken');    

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; // Obtém o token presente no header Authorization

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verifica o token do header da requisição e compara se é o mesmo definido na variavel de ambiente
        req.username = decoded; // instancia a variável decoded que verificou o token

        if (req.username.isAdmin){  // Verifica se o token possui a  propriedade isAdmin do usuário , se isAdmin = 1 é true
            next(); // Se o usuário for administrador, passa para o próximo middleware/controlador
        } else {
            res.status(401).json({ message: 'Not authorized.' }); // Se o usuário não for administrador, retorna erro de não autorizado
            console.log(token)
        }
        
    } catch (err) {
        res.status(401).json({ message: err.message }); // Se o token for inválido, retorna erro de token inválido
    }
};

module.exports = authMiddleware;