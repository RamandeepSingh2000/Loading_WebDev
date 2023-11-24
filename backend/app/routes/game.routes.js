const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const passport = require('passport');
const gameController = require('../controllers/game.controller');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', '..', 'temp');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Use the original file name
        cb(null, getRandomName() + '.' + (file.originalname?.split('.')?.pop()) ?? 'png');
    },
});

const upload = multer({ storage: storage });

//welcome message
router.route('/').get((req, res) => {
    res.status(200).json({"message": "Welcome to Loading."});
});

//get all games
router.route('/api/games').get(async (req, res) => {
    await gameController.getGames(req, res);
});

//get game by id
router.route('/api/games/:id').get(async (req, res) => {
    await gameController.getGameByID(req, res);
});


//add game
router.route('/api/games').post(upload.fields([
    { name: 'downloadFile', maxCount: 1 },
    { name: 'displayImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
  ]), 
  passport.authenticate('jwt', { session: false }),
   async(req, res) => { 
    await gameController.addGame(req, res);
    deleteFilesIfExist(req);
});

//put game
router.route('/api/games/:id').put(upload.fields([
  { name: 'downloadFile', maxCount: 1 },
  { name: 'displayImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 5 }
]), 
passport.authenticate('jwt', { session: false }),
 async(req, res) => {
    await gameController.putGame(req, res);    
});

//Delete game
router.route('/api/games/:id').delete(passport.authenticate('jwt', { session: false }),
async (req,res)=>{
  await gameController.deleteGame(req, res);
});

//For development
router.route('/api/games/').delete(async (req,res)=>{
  await gameController.deleteAll(req, res);
});

function getRandomName(){
  return crypto.randomBytes(32).toString('hex');
}

function deleteFilesIfExist(req){
  deleteFile(req.files['downloadFile']?.[0]?.path);
  deleteFile(req.files['displayImage']?.[0]?.path);
  if(req.files['additionalImages']){
    for(const image of req.files['additionalImages']){
      deleteFile(image.path);
    }
  }
}

function deleteFile(path){
  if(!path){
    return;
  }

  fs.unlink(path, (err) => {
    if(err){
      console.log(err);
    }
  })
}
module.exports = router;