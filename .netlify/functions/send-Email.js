require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const nodemailer = require('nodemailer');
const { Buffer } = require('buffer');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método não permitido' }),
        };
    }

    const { pdfBase64, email } = JSON.parse(event.body);

    // Crie um transporte de e-mail
    let transporter = nodemailer.createTransport({
        service: 'gmail', // ou outro serviço de e-mail
        auth: {
            user: process.env.EMAIL_USER, // E-mail do remetente
            pass: process.env.EMAIL_PASS // Senha do e-mail
        }
    });

    // Defina o conteúdo do e-mail
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Seu PDF Anexo',
        text: 'Segue em anexo o PDF solicitado.',
        attachments: [
            {
                filename: 'documento.pdf',
                content: Buffer.from(pdfBase64, 'base64'),
                encoding: 'base64'
            }
        ]
    };

    try {
        // Envie o e-mail
        let info = await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'E-mail enviado com sucesso', response: info.response }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao enviar e-mail', error }),
        };
    }
};
