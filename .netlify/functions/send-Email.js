const nodemailer = require('nodemailer');
const { Buffer } = require('buffer');

exports.handler = async function(event, context) {
  try {
    // Parse the request body
    const { pdfBase64, email } = JSON.parse(event.body);

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use seu serviço de e-mail
      auth: {
        user: process.env.EMAIL_USER, // Email do remetente
        pass: process.env.EMAIL_PASS, // Senha do email do remetente
      },
    });

    // Define email options
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

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail enviado com sucesso!' }),
    };
  } catch (error) {
    // Return error response with error details
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Falha ao enviar e-mail.',
        error: error.message,
        stack: error.stack
      }),
    };
  }
};
