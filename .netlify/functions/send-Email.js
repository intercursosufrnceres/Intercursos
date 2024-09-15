require('dotenv').config();
const nodemailer = require('nodemailer');
const { Buffer } = require('buffer');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método não permitido' }),
        };
    }

    let requestData;

    try {
        requestData = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Dados de entrada inválidos', error: error.message }),
        };
    }

    const { pdfBase64, email } = requestData;

    if (!pdfBase64 || !email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Dados incompletos. Certifique-se de enviar pdfBase64 e email.' }),
        };
    }

    let transporter;

    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao criar transporte de e-mail', error: error.message }),
        };
    }

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'intercursosufrnceres@gmail.com',
        subject: 'Seu PDF Anexo',
        text: 'Segue em anexo o PDF solicitado.',

    };

    try {
        let info = await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'E-mail enviado com sucesso', response: info.response }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao enviar e-mail', error: error.message }),
        };
    }
};
