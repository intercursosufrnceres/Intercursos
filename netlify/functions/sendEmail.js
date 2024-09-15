// netlify/functions/send-email.js
const nodemailer = require('nodemailer');
const { Buffer } = require('buffer');

exports.handler = async function(event, context) {
  const { pdfBase64, email } = JSON.parse(event.body);

  console.log('Recebendo e-mail para:', email); // Log para depuração

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use seu serviço de e-mail
    auth: {
      user: process.env.EMAIL_USER, // Email do remetente
      pass: process.env.EMAIL_PASS, // Senha do email do remetente
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PDF da Inscrição',
    text: 'Anexo está o PDF da sua inscrição.',
    attachments: [
      {
        filename: 'inscricao_intercursos.pdf',
        content: Buffer.from(pdfBase64, 'base64'),
        encoding: 'base64',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!'); // Log para depuração
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail enviado com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error); // Log para depuração
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Falha ao enviar e-mail.' }),
    };
  }
};
