const { getInsights } = require('./data-fetcher.js');
const express = require('express');

const port = 3000;
const app = express();
const router = express.Router();
app.use('/api/', router);
app.listen(port, () => console.log(`Instagram Analyzer server listening on port ${port}!`))

// app.use(function(req, res, next){
//   res.header('Access-Control-Allow-Origin','*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
//   next();
// });

router.get('/accounts/:id/insights', async (req, res, next) => {
  console.log("Called get insights")
  const id = req.params.id;
  try {
    const insights = await getInsights(id);
    console.log("Insights")
    console.log(insights)
    res.json({
      status: 'ok',
      insights: insights,
    });
  } catch(err) {
    console.error(err);
    next(err);
  }
});

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