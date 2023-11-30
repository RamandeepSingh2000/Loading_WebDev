const User = require("../models/user.model")
const jwt = require("jwt-simple");
const jwtSecret = process.env.JWT_SECRET;
 exports.login = function (req, res) {
    User.findOne({ username: req.body.username })
    .exec()
    .then(user => {
        var payload = {
            id: user.id,
            username: user.username,
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
    User.register(
        new User({
        email: req.body.email,
        username: req.body.username,
        isAdmin: false,
        gamesOwnedIds: req.body.gamesOwnedIds ?? []
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