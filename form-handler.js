// Integração do formulário com o Google Sheets
document.addEventListener('DOMContentLoaded', function() {
    // Carregar o script de integração com o Google Sheets
    const script = document.createElement('script');
    script.src = 'sheets-integration.js';
    document.head.appendChild(script);
    
    // Configurar o formulário para enviar dados
    document.getElementById('feedback-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const responseTime = document.querySelector('input[name="response_time"]:checked')?.value;
        const attendantName = document.getElementById('attendant_name').value;
        const comments = document.getElementById('comments').value;
        
        // Validar campos obrigatórios
        if (!rating || !responseTime) {
            alert('Por favor, preencha os campos obrigatórios: avaliação e tempo de resposta.');
            return;
        }
        
        // Preparar dados para envio
        const formData = {
            rating,
            responseTime,
            attendantName,
            comments,
            timestamp: new Date().toISOString()
        };
        
        // Tentar enviar dados para o Google Sheets
        try {
            sendToGoogleSheets(formData)
                .then(success => {
                    if (success) {
                        // Mostrar mensagem de agradecimento
                        document.getElementById('feedback-form').style.display = 'none';
                        document.getElementById('thank-you-message').style.display = 'block';
                    } else {
                        // Armazenar localmente se falhar
                        storeLocallyAndRetry(formData);
                        
                        // Ainda mostrar mensagem de agradecimento
                        document.getElementById('feedback-form').style.display = 'none';
                        document.getElementById('thank-you-message').style.display = 'block';
                    }
                });
        } catch (error) {
            console.error('Erro ao processar envio:', error);
            // Armazenar localmente se falhar
            storeLocallyAndRetry(formData);
            
            // Ainda mostrar mensagem de agradecimento
            document.getElementById('feedback-form').style.display = 'none';
            document.getElementById('thank-you-message').style.display = 'block';
        }
    });
});

// Função para armazenar dados localmente e tentar reenviar depois
function storeLocallyAndRetry(formData) {
    // Obter dados armazenados anteriormente
    let storedData = JSON.parse(localStorage.getItem('pendingFeedback') || '[]');
    
    // Adicionar novos dados
    storedData.push(formData);
    
    // Salvar no armazenamento local
    localStorage.setItem('pendingFeedback', JSON.stringify(storedData));
    
    console.log('Dados armazenados localmente para reenvio posterior');
}

// Tentar reenviar dados armazenados localmente quando a página carregar
window.addEventListener('online', function() {
    retryPendingSubmissions();
});

function retryPendingSubmissions() {
    // Verificar se há dados pendentes
    const pendingData = JSON.parse(localStorage.getItem('pendingFeedback') || '[]');
    
    if (pendingData.length === 0) {
        return;
    }
    
    console.log(`Tentando reenviar ${pendingData.length} avaliações pendentes`);
    
    // Criar uma cópia dos dados pendentes
    const dataToSend = [...pendingData];
    
    // Limpar armazenamento local
    localStorage.removeItem('pendingFeedback');
    
    // Tentar enviar cada item
    const sendPromises = dataToSend.map(formData => 
        sendToGoogleSheets(formData)
            .catch(error => {
                console.error('Falha ao reenviar:', error);
                return false;
            })
    );
    
    // Processar resultados
    Promise.all(sendPromises)
        .then(results => {
            // Identificar quais itens falharam
            const failedItems = dataToSend.filter((_, index) => !results[index]);
            
            // Se houver itens que falharam, armazená-los novamente
            if (failedItems.length > 0) {
                localStorage.setItem('pendingFeedback', JSON.stringify(failedItems));
                console.log(`${failedItems.length} itens ainda pendentes para reenvio`);
            } else {
                console.log('Todos os itens pendentes foram enviados com sucesso');
            }
        });
}
