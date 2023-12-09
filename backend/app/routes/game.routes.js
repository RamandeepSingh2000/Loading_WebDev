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
    limits: {
      fileSize: 1024 * 1024 * 5, // 5 MB file size limit (adjust as needed)
    }
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

//get unpublished games
router.route('/api/games/unpublished').get(
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
  await gameController.getUnpublishedGames(req, res);
})


//get game by id
router.route('/api/games/:id').get(async (req, res) => {
    await gameController.getGameByID(req, res);
});

//get game by id
router.route('/api/user/games/:id').get(
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
  await gameController.getGameByID(req, res);
});


//get games owned by user
router.route('/api/games/owned/:id').get(async (req, res) => {
  await gameController.getOwnedGames(req, res);
});
//get games purchased by user
router.route('/api/games/purchased/:id').get(async (req, res) => {
  await gameController.getPurchasedGames(req, res);
});
router.route('/api/admin/games').get(
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await gameController.getGamesAdmin(req, res);
})

router.route("/api/games/adminreview/:id/:newStatus").put(
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await gameController.updateGameApproval(req, res);
});

//add game
router.route('/api/games').post(
  passport.authenticate('jwt', { session: false }),
  upload.fields([
    { name: 'downloadFile', maxCount: 1 },
    { name: 'displayImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
  ]), 
  gameController.gameInputChecks,  
   async(req, res) => { 
    const validationSuccess = gameController.gameInputValidation(req, res);
    if(validationSuccess){
      await gameController.addGame(req, res);
    }    
    deleteFilesIfExist(req);
});

//put game
router.route('/api/games/:id').put(
passport.authenticate('jwt', { session: false }),
upload.fields([
  { name: 'downloadFile', maxCount: 1 },
  { name: 'displayImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 5 }
]), 
gameController.gameInputChecks,
   async(req, res) => {
    const validationSuccess = gameController.gameInputValidation(req, res);
    if(validationSuccess){
      await gameController.putGame(req, res);  
    }    
    deleteFilesIfExist(req);  
});

router.route('/api/games/download/free/:id').get(async (req,res)=>{
  await gameController.gameDownloadFree(req, res);
});

router.route('/api/games/download/:id').get(
  passport.authenticate('jwt', { session: false }),
  async (req,res)=>{
  await gameController.gameDownload(req, res);
});

router.route('/api/games/purchase/:id').post(
  passport.authenticate('jwt', { session: false }),
  async (req,res)=>{
  await gameController.gamePurchase(req, res);
});

router.route('/api/stripe/webhook').post(async (req, res) => {
  await gameController.stripeWebhook(req, res);
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

// async function deleteFilesIfExist(req) {
//   await deleteFileAsync(req.files['downloadFile']?.[0]?.path);
//   await deleteFileAsync(req.files['displayImage']?.[0]?.path);

//   if (req.files['additionalImages']) {
//     const deletePromises = req.files['additionalImages'].map((image) =>
//       deleteFileAsync(image.path)
//     );
//     await Promise.all(deletePromises);
//   }
// }

// async function deleteFileAsync(path) {
//   return new Promise((resolve) => {
//     if (!path) {
//       resolve();
//       return;
//     }

//     fs.unlink(path, (err) => {
//       if (err) {
//         console.error(err);
//       }
//       resolve();
//     });
//   });
// }

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