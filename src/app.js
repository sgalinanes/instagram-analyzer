import dataFetcher from './data-fetcher.js';
import express from 'express';

const app = express();
const port = 3000;
const router = express.Router();

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
  next();
});

router.get('/accounts/:id/insights', (req, res, next) => {
  const id = req.params.id;
  try {
    const insights = await dataFetcher.getInsights(id);
    res.json({
      status: 'ok',
      insights: insights,
    });
  } catch(err) {
    console.error(err);
    next(err);
  }
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))

// const hostname = '127.0.0.1';

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hola Mundo');
// });

// server.listen(port, hostname, () => {
//   getUserData();
//   console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
// });