const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método não permitido' }),
        };
    }

    const { to, subject, text, html } = JSON.parse(event.body);

    // Crie um transporte de e-mail
    let transporter = nodemailer.createTransport({
        service: 'gmail', // ou outro serviço de e-mail
        auth: {
            user: process.env.EMAIL_USER, // E-mail do remetente
            pass: process.env.EMAIL_PASS // Senha do e-mail
        }
    });

    // Defina os detalhes do e-mail
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
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
