import http from 'http';
import { getData } from './data-fetcher.js';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola Mundo');
});

server.listen(port, hostname, () => {
  getData();
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});