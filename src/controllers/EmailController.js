const User = require("../models/User");
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

// Configurar as credenciais da AWS, região e serviço SES
const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Substitua pelas suas credenciais de acesso
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION, // Substitua por sua região, por exemplo, 'us-east-1'
});

// Função para enviar e-mail de verificação
const sendVerificationEmail = (email, verificationCode) => {
    const params = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Text: {
                    Data: `Seu código de verificação é: ${verificationCode}`,
                },
            },
            Subject: {
                Data: 'Código de Verificação',
            },
        },
        Source: process.env.EMAIL_SENDER, // Substitua pelo seu e-mail de envio
    };

    return ses.sendEmail(params).promise();
};

exports.requestVerification = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Token de autorização não fornecido.' });
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token JWT não encontrado.' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Token JWT inválido.' });
        }

        const { username } = decodedToken;
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'O e-mail não foi fornecido.' });
        }

        const verificationCode = Math.floor(1000 + Math.random() * 9000); // Geração de um código de verificação

        await sendVerificationEmail(email, verificationCode); // Envio do e-mail de verificação
        await User.update({ verificationCode }, { where: { username } });

        res.status(200).json({ message: 'Email de verificação enviado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao solicitar a verificação de e-mail.' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Acessa o token JWT do cabeçalho
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token

        const { username } = decodedToken; // Obtém o nome de usuário a partir do token

        const { verificationCode } = req.body;   // validar o codigo de autenticaçai recebido no email para validar o email cadastrado

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se o código fornecido corresponde ao código de verificação do usuário
        if (verificationCode === user.verificationCode) {
            await User.update({ isEmailValidated: true }, { where: { username } });

            return res.status(200).json({ message: 'Email verificado com sucesso!' });
        } else {
            return res.status(403).json({ message: 'Código de verificação inválido. Verifique novamente.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


exports.updateUserEmail = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const { username } = decodedToken;
        const { email } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Salvar o estado atual do isEmailValidated
        const isEmailValidated = user.isEmailValidated;

        const [updatedRows] = await User.update({ email }, { where: { username } });

        if (updatedRows > 0) {
            console.log(`E-mail do usuário ${username} atualizado para ${email}`);

            // Reverter isEmailValidated para false após a atualização do e-mail
            if (isEmailValidated) {
                await User.update({ isEmailValidated: false }, { where: { username } });
                console.log('Status isEmailValidated revertido para false.');
            }

            res.status(200).json({ message: '🤖 E-mail Atualizado com Sucesso. 🤖' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '⚠ E-mail inválido ou já cadastrado ⚠' });
    }
};
