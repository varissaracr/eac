const express = require('express')
const app = express()
const port = 3000

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.use('/', express.static('www'))

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})