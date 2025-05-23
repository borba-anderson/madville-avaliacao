// Arquivo para integração com Google Sheets
// Este script utiliza a API do Google Sheets para armazenar as respostas do formulário

// Configuração da planilha
const SHEET_ID = 'AKfycbxddAZA2Ow5UlVpo-kuY0S8yDRU1BJzg7hs-Q35Iv6l9znY4FIf0vfb1FjfKpjRmqG9'; // Será preenchido após a criação da planilha
const SHEET_TAB_NAME = 'Respostas';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxddAZA2Ow5UlVpo-kuY0S8yDRU1BJzg7hs-Q35Iv6l9znY4FIf0vfb1FjfKpjRmqG9/exec'; // Será preenchido após a publicação do script

// Função para enviar dados para o Google Sheets
function sendToGoogleSheets(formData) {
    // Preparar dados para envio
    const data = {
        timestamp: formData.timestamp,
        rating: formData.rating,
        responseTime: formData.responseTime,
        attendantName: formData.attendantName || 'Não informado',
        comments: formData.comments || 'Sem comentários'
    };
    
    // Enviar dados via fetch API
    return fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Dados enviados com sucesso!');
        return true;
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
        return false;
    });
}
