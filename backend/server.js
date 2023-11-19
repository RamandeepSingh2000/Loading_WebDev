const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./app/routes/game.routes');
const dotenv = require('dotenv');

dotenv.config();
const mongoDBConnectionString = process.env.MONGODB_CONNECTION_STRING;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoDBConnectionString,
{useNewUrlParser:true});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("DB connected......");
})

app.use(routes);
app.listen(8081,()=>{
    console.log("Server is running on 8081....");
});
