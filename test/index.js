const express = require('express')
const mock = require('../src');
const app = express()

app.use(mock({
  dir: '../',
  path: '/api'
}));

app.listen(8000)
console.log('start success=======', 'http://localhost:8000/api/test/test1')
