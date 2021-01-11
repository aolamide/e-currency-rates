const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/api/rates', (req, res) => {
  const [base, currencies] = [req.query.base, req.query.currency];

  //if base is not passed, return error to client
  if(!base) return res.status(400).json({ error : 'Base is required' });

  //if currencies to get rates for are not passed, return error to client
  if(!currencies) return res.status(400).json({ error : 'Currencies to get rates are required' });

  //fetch rates
  axios.get(`https://api.exchangeratesapi.io/latest?base=${base.toUpperCase()}&symbols=${currencies.toUpperCase()}`, { timeout : 6000 })
  .then(response => {
    return res.json({ results : response.data })
  })
  .catch(err => {
    //if error occured, return error message to client
    if(err.response) return res.status(err.response.status).json(err.response.data)
    else if(err.request) return res.status(500).json({error : err.toJSON().message})
    else res.status(500).json({ error : err.message })
  })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
});