const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const appSettings = require('./configReader');
const routes = require('./app/routes/game.routes');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(appSettings.mongodbConnectionString,
{useNewUrlParser:true});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("DB connected......");
})

app.use(routes);
app.listen(8081,()=>{
    console.log("Server is running on 8081....");
});
