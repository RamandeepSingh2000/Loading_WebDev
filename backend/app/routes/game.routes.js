const express = require('express');
const router = express.Router();
const gameModel = require('../models/game.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Use the original file name
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

//welcome message
router.route('/').get((req, res) => {
    res.status(200).json({"message": "Welcome to Loading."});
});

//get all games
router.route('/api/games').get(async (req, res) => {
    try {
      const games = await gameModel.find();
  
      const gamesDisplayInfos = await Promise.all(
        games.map(async (game) => {

          let fileContent = await getFileContent(path.basename(game.displayImageURL)); //for testing
  
          return {
            _id: game._id,
            name: game.name,
            price: game.price,
            tags: game.tags,
            displayImage: fileContent,
          };
        })
      );
  
      // Set appropriate headers for the response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'inline; filename=response.json');
  
      // Send the JSON object as a response
      res.status(200).send(gamesDisplayInfos);
    } catch (err) {
      res.status(400).json({ Error: err.message || err });
    }
  });

//get game by id
router.route('/api/games/:id').get((req, res) => {
    gameModel.findById(req.params.id)
    .then(async game => {

      let displayImage = await getFileContent(path.basename(game.displayImageURL)); //for testing
      let downloadFile = await getFileContent(path.basename(game.downloadFileURL)); //for testing
      let additionalImages = await Promise.all(        
        game.additionalImagesURLs.map(async imageURL => {
          return await getFileContent(path.basename(imageURL)); //for testing
        })
      );

      let gameData = {
        _id: game._id,
        name: game.name,
        description: game.description,
        downloadFile: downloadFile,
        displayImage: displayImage,
        additionalImages: additionalImages,
        price: game.price,
        ownerId: game.ownerId,
        collaboratorsIds: game.collaboratorsIds,
        uploadDate: game.uploadDate,
        publishDate: game.publishDate,
        tags: game.tags,
        genre: game.genre,
        supportedPlatforms: game.supportedPlatforms,
        additionalTechnicalDescription: game.additionalTechnicalDescription,
        status: game.status
      };

      res.status(200).send(gameData);  
  })
    .catch(err => res.status(400).json({"Error": err}));
});


//add game
router.route('/api/games').post(upload.fields([
    { name: 'downloadFile', maxCount: 1 },
    { name: 'displayImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
  ]), async(req, res) => {
    
    const gameData = req.body;
    const { name, description, price, ownerId, 
        collaboratorsIds, uploadDate, publishDate, 
        tags, genre, supportedPlatforms, additionalTechnicalDescription, status } = gameData;

    let game = new gameModel({
        name,
        description,
        downloadFileURL: req.files['downloadFile'] ? req.files['downloadFile'][0].path : "",
        displayImageURL: req.files['displayImage'] ? req.files['displayImage'][0].path : "",
        additionalImagesURLs: req.files['additionalImages'] ? req.files['additionalImages'].map(file => file.path) : [],
        price,
        ownerId,
        collaboratorsIds,
        uploadDate,
        publishDate,
        tags,
        genre,
        supportedPlatforms,
        additionalTechnicalDescription,
        status
      });
      game.save()
    .then(game => res.status(200).json(game))
    .catch(err => res.status(400).json({"Error": err}));
});

//put game
router.route('/api/games/:id').put(upload.fields([
  { name: 'downloadFile', maxCount: 1 },
  { name: 'displayImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 5 }
]), async(req, res) => {
  
  gameModel.findById(req.params.id)
  .then(game =>{
    game.name = req.body.name;
    game.description = req.body.description;
    game.downloadFileURL = req.files['downloadFile'] ? req.files['downloadFile'][0].path : "";
    game.displayImageURL = req.files['displayImage'] ? req.files['displayImage'][0].path : "";
    game.additionalImagesURLs = req.files['additionalImages'] ? req.files['additionalImages'].map(file => file.path) : [];
    game.price = req.body.price;
    game.ownerId = req.body.ownerId;
    game.collaboratorsIds = req.body.collaboratorsIds;
    game.uploadDate = req.body.uploadDate;
    game.publishDate = req.body.publishDate;
    game.tags = req.body.tags;
    game.genre = req.body.genre;
    game.supportedPlatforms = req.body.supportedPlatforms;
    game.additionalTechnicalDescription = req.body.additionalTechnicalDescription;
    game.status = req.body.status;
    game.save()
    .then(game => res.status(200).json(game))
    .catch(err => res.status(400).json({"Error": err}));
  })
  .catch(err => res.status(400).json({"Error": err}));
  
});

//Delete game
router.route('/api/games/:id').delete((req,res)=>{
  gameModel.findById(req.params.id)
  .then(game =>{
    game.deleteOne()
    .then(() => res.status(200).send("Deleted successfully"))
    .catch(err => res.status(400).json({"Error": err}));
  })
  .catch(err => res.status(400).json({"Error": err}));
});
async function getFileContent(fileName)
{
    const filePath = path.join(__dirname, '..', '..', 'uploads', fileName); //for testing  
    let fileContent = null;

    try {
      const stats = await fs.promises.stat(filePath);

      if (!stats.isDirectory()) {
        fileContent = await fs.promises.readFile(filePath, 'utf-8');
      }
    } catch (err) {
      console.error(`Error reading file ${filePath}: ${err.message}`);
    }

    return fileContent;    
}

module.exports = router;