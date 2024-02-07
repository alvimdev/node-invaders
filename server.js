const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/ur.json') {
        // Ler o arquivo ur.json e enviar seu conteúdo como resposta
        fs.readFile(path.join(__dirname, 'ur.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/ur.json') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convertendo os dados para string
        });
        req.on('end', () => {
            // Processar os dados recebidos do corpo da solicitação
            const userData = JSON.parse(body);
            
            // Aqui você pode salvar os dados do usuário em um arquivo ou banco de dados
            console.log("Nome de usuário:", userData.nome);
            console.log("Pontuação:", userData.pontuacao);
            
            // Enviar uma resposta de volta para o cliente
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "User data saved successfully" }));
        });
    } else {
        // Se a rota não for encontrada, responder com "Not Found"
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
