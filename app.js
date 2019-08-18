const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {useNewUrlParser : true});

const userRoutes = require('./routes/user');

const app = express();
app.use(bodyParser.json());

app.use('/api/user', userRoutes);


app.get('/', (req,res,next) => res.send('Hello World'));


app.listen(PORT, HOST, () => console.log(`Listening on port ${PORT} on ${HOST}!`));