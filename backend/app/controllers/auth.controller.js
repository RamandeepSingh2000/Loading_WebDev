const User = require("../models/user.model")
const jwt = require("jwt-simple");
const {check, validationResult} = require("express-validator");
const jwtSecret = process.env.JWT_SECRET;
 exports.login = function (req, res) {
    User.findOne({ username: req.body.username })
    .exec()
    .then(user => {
        var payload = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            expire: Date.now() + 1000 * 60 * 60 * 24 * 7
        }

        var token = jwt.encode(payload, jwtSecret);
        res.json({ token: token });
    })
    .catch(err => {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    });
}



 exports.register = function (req, res) {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({checkErrors : errors.array()});
            return false;
        }  
        
    User.register(
        new User({
        email: req.body.email,
        username: req.body.username,
        isAdmin: false,
        gamesOwnedIds: [],
        gamesPurchasedIds: []
        }), 
        req.body.password, 
        function (err, msg) {
            if (err) {
            res.send(err);
            } else {
            res.send({ message: "Successful" });
            }
        }
    );
 };

 
 exports.adminregister = async function (req, res) {

    const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({checkErrors : errors.array()});
            return false;
        }        

    let requestMaker = await User.findById(req.user.id);
    if(!requestMaker.isAdmin){
        res.send({ error: "Only admins can create admin account." });
        return;
    }
    
    User.register(        
        new User({
        email: req.body.email,
        username: req.body.username,
        isAdmin: true,
        gamesOwnedIds: [],
        gamesPurchasedIds: []
        }), 
        req.body.password, 
        function (err, msg) {
            if (err) {
            res.send(err);
            } else {
            res.send({ message: "Successful" });
            }
        }
    );
 };

 exports.adminregisterdev = async function (req, res) {

    const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({checkErrors : errors.array()});
            return false;
        }      
    
    User.register(        
        new User({
        email: req.body.email,
        username: req.body.username,
        isAdmin: true,
        gamesOwnedIds: [],
        gamesPurchasedIds: []
        }), 
        req.body.password, 
        function (err, msg) {
            if (err) {
            res.send(err);
            } else {
            res.send({ message: "Successful" });
            }
        }
    );
 };

 exports.validationChecks = [check('username', "The username should be 3-15 characters long.")
 .exists()
 .isLength({min: 3, max: 15}),

 check('email', "The email should be valid.")
 .exists()
 .isEmail(),

 check('password', "The password should be 5-15 characters long.")
 .exists()
 .isLength({min: 5, max: 15})]