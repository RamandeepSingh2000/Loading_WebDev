const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./app/routes/auth.routes.js');
const gameRoutes = require('./app/routes/game.routes');
const User = require('./app/models/user.model')
const authMiddleware = require('./app/middleware/auth.js');
const LocalStrategy = require('passport-local');
const passport = require('passport');

const mongoDBConnectionString = process.env.MONGODB_CONNECTION_STRING;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
authMiddleware();

mongoose.connect(mongoDBConnectionString,
{useNewUrlParser:true});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("DB connected......");
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
app.use(passport.initialize());
app.use(authRoutes);
app.use(gameRoutes);
app.listen(8081,()=>{
    console.log("Server is running on 8081....");
});
