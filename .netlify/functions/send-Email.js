const nodemailer = require('nodemailer');
const { Buffer } = require('buffer');

exports.handler = async function(event, context) {
  const { pdfBase64 } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use seu serviço de e-mail
    auth: {
      user: process.env.EMAIL_USER, // Email do remetente
      pass: process.env.EMAIL_PASS, // Senha do email do remetente
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'intercursosufrnceres@gmail.com', // Definido diretamente aqui
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
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail enviado com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error); // Adiciona um log do erro
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Falha ao enviar e-mail.', error: error.message }), // Inclui o erro no corpo da resposta
    };
  }
};
