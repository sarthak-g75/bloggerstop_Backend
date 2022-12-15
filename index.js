const connectToMongo = require('./db');
const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors') 
require('dotenv').config();
app.use(express.json()) 
app.use(cors())

//Available Routes
app.use('/api/auth',require('./routes/auth')) 
app.use('/api/blogs',require('./routes/blogs'))

connectToMongo();
 
app.use(cors())
app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`)
})