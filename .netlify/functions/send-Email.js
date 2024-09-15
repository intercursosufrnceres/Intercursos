const nodemailer = require('nodemailer');
const { Buffer } = require('buffer');

exports.handler = async function(event, context) {
  console.log('Request received');

  try {
    // Verificar o corpo da solicitação
    const { pdfBase64, email } = JSON.parse(event.body);
    console.log('PDF Base64:', pdfBase64);
    console.log('Recipient Email:', email);

    // Configurar o transportador de e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Opções do e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Usar o e-mail passado na solicitação
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

    console.log('Mail Options:', mailOptions);

    // Enviar e-mail
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail enviado com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Falha ao enviar e-mail back.', error: error.message }),
    };
  }
};
