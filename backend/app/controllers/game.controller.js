const gameModel = require('../models/game.model');
const userModel = require('../models/user.model');
const sharp = require('sharp');
const jwt = require("jwt-simple");
module.exports = {
    getGames : async function(req, res){
        try {
            const filter = {};
            const filterTags = req.query.tags;
            if(filterTags){
                
                const tagsArray = filterTags.split(',').map(tag => tag.trim());
                filter.tags = { $in: tagsArray };
            };

            const filterGenre = req.query.genre;
            if(filterGenre){
                
                filter.genre = filterGenre;
            }

            const filterSupportedPlatforms = req.query.supportedPlatforms;
            if(filterSupportedPlatforms){
                
                const platforms = filterSupportedPlatforms.split(',').map(platform => platform.trim());
                filter.supportedPlatforms = { $in: platforms };
            }

            const numberOfGames = req.query.numberOfGames ?? 5;
            const games = await gameModel.find(filter).limit(numberOfGames);
        
            const gamesDisplayInfos = await Promise.all(
              games.map(async (game) => {
                const displayImageURL = await getImageURL(game.displayImageRef);    
                return {
                  _id: game._id,
                  name: game.name,
                  price: game.price,
                  tags: game.tags,
                  displayImageURL: displayImageURL,
                };
              })
            );
        
            res.status(200).send(gamesDisplayInfos);
        } 
        catch (err) {
            res.status(400).json({ Error: err.message || err });
        }    
    },

    getGameByID : async function(req, res){
        try{
            const game = await gameModel.findById(req.params.id);     
            const downloadFileURL = await getFileURL(game.downloadFileRef);       
            const displayImageURL = await getImageURL(game.displayImageRef);  
            const additionalImagesURLS = await Promise.all(
                game.additionalImagesRefs.map(async (imageRef) => {
                    return getImageURL(imageRef);
                })
            );
            let gameData = {
                _id: game._id,
                name: game.name,
                description: game.description,
                downloadFileURL: downloadFileURL,
                displayImageURL: displayImageURL,
                additionalImagesURLs: additionalImagesURLS,
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
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },
    
    addGame : async function(req, res){
        try{
            var user = await userModel.findById(req.user.id);
            if(user.isAdmin){
                res.json({ Error: "A game cannot be created from an admin account." });
                return;
            }
            const gameData = req.body;
            const { name, description, price, ownerId, 
                collaboratorsIds, tags, genre, supportedPlatforms, additionalTechnicalDescription } = gameData;

            const uploadDate = Date.now();
            const publishDate = "";
            const status = "Uploaded";

            const downloadFileRef = await saveFile(processFile(req.files['downloadFile']?.[0]?.path));
            const displayImageRef = await saveImage(processImage(req.files['displayImage']?.[0]?.path));
            const additionalImagesRefs = await Promise.all((req.files['additionalImages'] ?? []).map(async (image) => {
                return await saveImage(await processImage(image.path));
            }));

            const game = new gameModel({
                name,
                description,
                downloadFileRef: downloadFileRef,
                displayImageRef: displayImageRef,
                additionalImagesRefs: additionalImagesRefs,
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
            
            var gameId = (await game.save()).id;
            user.gamesOwnedIds.push(gameId);  
            await user.save();
            res.status(200).send(gameData);
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },
    
    putGame : async function(req, res){
        try{

            var user = await userModel.findById(req.user.id);
            if(!user.gamesOwnedIds.includes(req.params.id)){
                res.status(401).json({ Error: "You don't own this game." });
                return;
            }

            const gameData = req.body;
            const game = await gameModel.findById(req.params.id);
            const downloadFileRef = await saveFile(processFile(req.files['downloadFile']?.[0]?.path));
            const displayImageRef = await saveImage(processImage(req.files['displayImage']?.[0]?.path));
            const additionalImagesRefs = await Promise.all((req.files['additionalImages'] ?? []).map(async (image) => {
                return await saveImage(await processImage(image.path));
            }));
            const { name, description, price, ownerId, 
                collaboratorsIds, tags, genre, supportedPlatforms, additionalTechnicalDescription } = gameData;

            game.name = name;
            game.description = description;
            game.downloadFileRef = downloadFileRef;
            game.displayImageRef = displayImageRef;
            game.additionalImagesRefs = additionalImagesRefs;
            game.price = price;
            game.ownerId = ownerId;
            game.collaboratorsIds = collaboratorsIds;
            game.tags = tags;
            game.genre = genre;
            game.supportedPlatforms = supportedPlatforms;
            game.additionalTechnicalDescription = additionalTechnicalDescription;
            await game.save();  
            res.status(200).send(gameData);
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },

    deleteGame : async function(req, res){
        try{

            var user = await userModel.findById(req.user.id);
            if(!user.gamesOwnedIds.includes(req.params.id)){
                res.status(401).json({ Error: "You don't own this game." });
                return;
            }            

            const game = await gameModel.findById(req.params.id);
            for (let i = user.gamesOwnedIds.length - 1; i >= 0; --i) {
                if (user.gamesOwnedIds[i] == game.id){
                
                    user.gamesOwnedIds.splice(i, 1);
                }
            }

            await user.save();
            //delete files from cloud later
            await game.deleteOne();
            res.status(200).send("Deleted successfully");
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },

    deleteAll : async function(req, res){
        try{
            await gameModel.deleteMany();
            res.status(200).send("Deleted All successfully");
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    }
}

//for testing
async function getImageURL(imageRef){
    return "https://picsum.photos/300";
}

async function getFileURL(fileRef){
    return "https://picsum.photos/300";
}

function processFile(originalFilePath){
    return originalFilePath;
}

async function processImage(originalImagePath){
    if(!originalImagePath){
        return null;
    }

    return await sharp(originalImagePath).resize({height: 500, width: 500, fit: 'contain'}).toBuffer();
}

async function saveFile(file){
    return "This is a file ref";
}

async function saveImage(image){
    return "This is an image ref";
}