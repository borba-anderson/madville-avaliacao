// URL gerada após publicar o Google Apps Script como Web App
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxddAZA2Ow5UlVpo-kuY0S8yDRU1BJzg7hs-Q35Iv6l9znY4FIf0vfb1FjfKpjRmqG9/exec';

// Função para enviar dados para o Google Sheets
function sendToGoogleSheets(formData) {
    const data = {
        rating: formData.rating,
        responseTime: formData.responseTime,
        attendantName: formData.attendantName || 'Não informado',
        comments: formData.comments || 'Sem comentários'
    };

    return fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('✅ Dados enviados com sucesso!');
        return true;
    })
    .catch(error => {
        console.error('❌ Erro ao enviar dados:', error);
        return false;
    });
}
