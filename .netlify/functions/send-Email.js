exports.handler = async function(event, context) {
  console.log('Request received');
  
  try {
    // Verificar o corpo da solicitação
    const body = JSON.parse(event.body);
    
    // Verificar se os campos esperados estão presentes
    if (!body.pdfBase64 || !body.email) {
      console.error('Corpo da solicitação inválido:', body);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Corpo da solicitação inválido. Verifique os campos pdfBase64 e email.' }),
      };
    }
    
    console.log('PDF Base64:', body.pdfBase64);
    console.log('Recipient Email:', body.email);

    // Se o corpo estiver correto
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Corpo da solicitação recebido com sucesso.' }),
    };
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao processar solicitação.', error: error.message }),
    };
  }
};
