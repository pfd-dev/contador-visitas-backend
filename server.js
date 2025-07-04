import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';

const PORT = 3000;
const DB_PATH = path.resolve('./counter.json');

http.createServer((req, res) => {
    // Leer el archivo JSON con las visitas actuales
    fs.readFile(DB_PATH, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error leyendo el archivo:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Error interno del servidor');
        }

        let json;
        try {
            json = JSON.parse(data);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Datos corruptos');
        }

        // Incrementar contador
        json.visits++;

        // Guardar de nuevo en el archivo
        fs.writeFile(DB_PATH, JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.error('Error escribiendo el archivo:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error interno del servidor');
            }

            // Mostrar en pantalla el número de visitas
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<h1>Bienvenido! Esta página ha sido visitada ${json.visits} veces.</h1>`);
        });
    });
}).listen(PORT);

console.log(`Servidor corriendo en http://localhost:${PORT}`);
