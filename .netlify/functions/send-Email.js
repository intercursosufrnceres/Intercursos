const nodemailer = require('nodemailer');
const { Buffer } = require('buffer');

exports.handler = async function(event, context) {
    // Verificar o método HTTP
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método não permitido' }),
        };
    }

    let requestData;

    // Tentar parsear os dados do corpo da requisição
    try {
        requestData = JSON.parse(event.body);
        console.log('Dados recebidos:', requestData);
    } catch (error) {
        console.error('Erro ao parsear dados:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Dados de entrada inválidos', error: error.message }),
        };
    }

    const { pdfBase64, email } = requestData;

    // Verificar se os dados necessários foram fornecidos
    if (!pdfBase64 || !email) {
        console.error('Dados incompletos. Certifique-se de enviar pdfBase64 e email.');
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Dados incompletos. Certifique-se de enviar pdfBase64 e email.' }),
        };
    }

    let transporter;

    // Criar o transporte de e-mail
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Acessa a variável de ambiente
                pass: process.env.EMAIL_PASS  // Acessa a variável de ambiente
            }
        });
        console.log('Transporte de e-mail criado com sucesso.');
    } catch (error) {
        console.error('Erro ao criar transporte de e-mail:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao criar transporte de e-mail', error: error.message }),
        };
    }

    // Configurar opções do e-mail
    let mailOptions = {
        from: process.env.EMAIL_USER, // Acessa a variável de ambiente
        to: email,
        subject: 'Seu PDF Anexo',
        text: 'Segue em anexo o PDF solicitado.',
        attachments: [
            {
                filename: 'documento.pdf',
                content: Buffer.from(pdfBase64, 'base64'), // Adiciona o PDF como anexo
                encoding: 'base64'
            }
        ]
    };

    // Tentar enviar o e-mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso:', info.response);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'E-mail enviado com sucesso', response: info.response }),
        };
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao enviar e-mail', error: error.message }),
        };
    }
};
