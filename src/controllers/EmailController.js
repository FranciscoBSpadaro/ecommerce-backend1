const User = require("../models/User");
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const passwordUtils = require('../utils/passwordUtils');   

// Configurar as credenciais da AWS, região e serviço SES
const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Substitua pelas suas credenciais de acesso
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION, // Substitua por sua região, por exemplo, 'us-east-1'
});

// Função para enviar e-mail de verificação
exports.sendVerificationEmail = (email, verificationCode) => {
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

const sendNewPassword = (email, newpassword) => {   // não é exportado para outros controladores
    const params = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Text: {
                    Data: `Sua nova senha é: \n ${newpassword}  \n Troque sua senha após o Login`,
                },
            },
            Subject: {
                Data: 'Nova senha Temporária ',
            },
        },
        Source: process.env.EMAIL_SENDER,
    };

    return ses.sendEmail(params).promise();
};

exports.sendWelcome = (email, verificationCode) => {
    const link = `${process.env.APP_URL}/profile`; // Defina a variável link conforme necessário
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Data: `Bem vindo ao nosso comércio eletrônico. \n Não esqueça de validar seu e-mail \n Seu código de verificação é: \n ${verificationCode} \n Utilize esse código no Menu de perfil: ${link}`,
          },
        },
        Subject: {
          Data: 'Cadastro Realizado com Sucesso na Loja Virtual',
        },
      },
      Source: process.env.EMAIL_SENDER,
    };
  
    return ses.sendEmail(params).promise();
  };


//função para gerar um codigo mais complexo
//import { generateVerificationCode } from '../utils/VerificationCode';
const generateVerificationCode = require('../utils/VerificationCode');   

exports.requestVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const emailExists = await User.findOne({ where: { email } }); // Verifica se o email existe no banco de dados
        if (!emailExists) {
            return res.status(404).json({ message: 'Email não Cadastrado' });
        }
        //const verificationCode = Math.floor(1000 + Math.random() * 9000);  gera codigo de 4 numeros apenas
        const verificationCode = generateVerificationCode(8); // Gera um código de 8 caracteres para verificação

        await sendVerificationEmail(email, verificationCode); // Envio do e-mail de verificação
        await User.update({ verificationCode }, { where: { email } });

        return res.status(200).json({ message: 'Email de verificação enviado com sucesso!' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro ao solicitar a verificação de e-mail.' });
    }
};


exports.requestNewPassword = async (req, res) => {
    try {
        const { verificationCode, email } = req.body;   // corpo da requisição deve ter um verification code
        const user = await User.findOne({ where: { email, verificationCode } });  // procura no db na tabela User.js o email fornecido e o codigo de verificação

        if (!user) {
            return res.status(404).json({ message: 'Código de verificação inválido.' });   // erro 404 caso nao encontrar email ou codigo invalido
        }

        const newpassword = generateVerificationCode(16); // Gera um código de 16 caracteres para a nova senha
        const hashedPassword = await passwordUtils.hashPassword(newpassword); 
        await User.update({ password: hashedPassword }, { where: { email } }); // salva a nova senha criptografada no db / o usuario deve trocar de senha e ter a senha criptografada
        await sendNewPassword(email, newpassword); // Envio do e-mail de senha provisória de 16 caracteres

        return res.status(200).json({ message: 'Email com nova senha enviado!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro ao solicitar a nova senha.' });
    }
};


exports.verifyEmail = async (req, res) => {
    try {

        const { verificationCode, email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Email não cadastrado.' });
        }

        // Verificar se o código fornecido corresponde ao código de verificação do usuário
        if (verificationCode === user.verificationCode) {
            await User.update({ isEmailValidated: true }, { where: { email } });

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

        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: '⚠ E-mail já cadastrado. ⚠' });
        }

        // Salvar o estado atual do isEmailValidated
        const isEmailValidated = emailExists.isEmailValidated;

        const [updatedRows] = await User.update({ email }, { where: { username } });

        if (updatedRows > 0) {
            console.log(`E-mail do usuário ${username} atualizado para ${email}`);

            // Reverter isEmailValidated para false após a atualização do e-mail
            if (isEmailValidated) {
                await User.update({ isEmailValidated: false }, { where: { username } });
                console.log('Status isEmailValidated revertido para false.');
            }
            await sendVerificationEmail(email, verificationCode); // Envio do e-mail de verificação
            await User.update({ verificationCode }, { where: { email } });

            res.status(200).json({ message: '🤖 E-mail Atualizado com Sucesso. Enviado novo codigo de verificação 🤖' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '⚠ E-mail inválido ou já cadastrado ⚠' });
    }
};
