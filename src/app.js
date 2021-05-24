const { getInsights, getBusinessData } = require('./data-fetcher.js');
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

app.use(function(err, req, res, next) {
  // Only handle `next(err)` calls
  res.json({
    status: req.status,
    error: err,
    error_message: err.message
  })
});

router.get('/accounts/:id/insights', async (req, res, next) => {
  const id = req.params.id;
  try {
    const insights = await getInsights(id);
    res.json({
      status: 'ok',
      insights: insights,
    });
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.get('/accounts/:id/business', async (req, res, next) => {
  const id = req.params.id
  try {
    const businessData = await getBusinessData(id);
    res.json({
      status: 'ok',
      businessData: businessData
    })
  } catch(err) {
    console.error(err);
    next(err);
  }
})