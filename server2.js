import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join('/data', 'counter.json');

// Crea el archivo si no existe
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ visits: 0 }, null, 2));
}

http.createServer((req, res) => {
    if (req.url === '/api/visits' && req.method === 'GET') {
        fs.readFile(DB_PATH, 'utf-8', (err, data) => {
            if (err) return res.end(JSON.stringify({ error: 'No se pudo leer DB' }));

            const json = JSON.parse(data);
            json.visits++;

            fs.writeFile(DB_PATH, JSON.stringify(json, null, 2), (err) => {
                if (err) return res.end(JSON.stringify({ error: 'No se pudo guardar DB' }));

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(json));
            });
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
}).listen(PORT);

console.log(`Servidor corriendo en http://localhost:${PORT}`);
