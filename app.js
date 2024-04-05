

/* require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }); */

const express = require('express')
const app = express()

app.listen(3000, ()=> {
    console.log('Server is running, yo! on port 3000')
})

app.get('/', (req, res) =>{
    res.send('Hello from node API!');
})