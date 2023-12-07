const gameModel = require('../models/game.model');
const userModel = require('../models/user.model');
const sharp = require('sharp');
const jwt = require("jwt-simple");
const {check, validationResult} = require("express-validator");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
const {Upload} = require('@aws-sdk/lib-storage');
const crypto = require('crypto');
const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
const fs = require('fs').promises;

const s3 = new S3Client({
    credentials:{
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.BUCKET_REGION
})
module.exports = {
    getGames : async function(req, res){
        try {
            const searchKeyword = req.query.searchKeyword;
            let customQuery = {};
            if (searchKeyword) {
                customQuery = {
                  $and: [
                    {
                      $or: [
                        { name: { $regex: searchKeyword, $options: 'i' } },
                        { tags: { $in: [searchKeyword] } },
                        { genre: { $regex: searchKeyword, $options: 'i' } },
                        { supportedPlatforms: { $in: [searchKeyword] } },
                      ],
                    },
                    { status: "Published" },
                  ],
                };
              } else {
                customQuery = { status: "Published" };
              }
            const numberOfGames = req.query.numberOfGames ?? 5;
            const games = await gameModel.find(customQuery).limit(numberOfGames);
            
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

    getOwnedGames: async function(req, res){

        try{
        const userId = req.params.id;
        let customQuery = {ownerId : userId};
        const games = await gameModel.find(customQuery);
        
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
    getPurchasedGames: async function(req, res){

        try{
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        
        const gamesDisplayInfos = await Promise.all(
          user.gamesPurchasedIds.map(async (gameId) => {
            const game = await gameModel.findById(gameId);
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
            //const downloadFileURL = await getFileURL(game.downloadFileRef);       
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
                //downloadFileURL: downloadFileURL,
                displayImageURL: displayImageURL,
                additionalImagesURLs: additionalImagesURLS,
                price: game.price,
                ownerId: game.ownerId,
                //collaboratorsIds: game.collaboratorsIds,
                uploadDate: game.uploadDate,
                publishDate: game.publishDate,
                tags: game.tags,
                genre: game.genre,
                supportedPlatforms: game.supportedPlatforms,
                additionalTechnicalDescription: game.additionalTechnicalDescription,
                status: game.status
              };    
              if(req.user){
                let user = await userModel.findById(req.user.id);
                gameData.purchased = user.gamesPurchasedIds.includes(game.id);
              }    
              res.status(200).send(gameData);
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },

    getUnpublishedGames : async function(req, res){
        try{
            const userId = req.user.id;

            var user = await userModel.findById(userId)
            if(!user.isAdmin){
                res.json({ Error: "Only admins can see unpublished games." });
                return;
            }
            let customQuery = {status : "Uploaded"};
            const games = await gameModel.find(customQuery);
            
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
    
    addGame : async function(req, res){
        try{
            var user = await userModel.findById(req.user.id);
            if(user.isAdmin){
                res.json({ Error: "A game cannot be created from an admin account." });
                return;
            }

            

            const gameData = req.body;
            const { name, description, price,  
                collaboratorsIds, genre, additionalTechnicalDescription } = gameData;

            const uploadDate = Date.now();
            const publishDate = "";
            const status = "Uploaded";
            const ownerId = user.id;
            let tags = [];
            if(gameData.tags){
                tags = gameData.tags.split(',').map(tag => tag.trim());
            } 
            let supportedPlatforms = [];
            if(gameData.supportedPlatforms){
                supportedPlatforms = gameData.supportedPlatforms.split(',').map(supportedPlatform => supportedPlatform.trim());
            } 
            const downloadFileRef = await saveFile(await processFile(req.files['downloadFile']?.[0]));
            const displayImageRef = await saveImage(await processImage(req.files['displayImage']?.[0]));
            const additionalImagesRefs = await Promise.all((req.files['additionalImages'] ?? []).map(async (image) => {
                return await saveImage(await processImage(image));
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
            const downloadFileRef = await updateFile(await processFile(req.files['downloadFile']?.[0]), game.downloadFileRef);
            const displayImageRef = await updateImage(await processImage(req.files['displayImage']?.[0]), game.displayImageRef);
            await Promise.all((game.additionalImagesRefs).map(async (ref) => {
                return await deleteFile(ref);
            }));
            const additionalImagesRefs = await Promise.all((req.files['additionalImages'] ?? []).map(async (image, index) => {
                return await saveImage(await processImage(image), game.additionalImagesRefs[index]);
            }));
            const { name, description, price,  
                collaboratorsIds, genre, additionalTechnicalDescription } = gameData;
                const ownerId = user.id;
                const uploadDate = Date.now();
                const status = 'Uploaded';
                let tags = [];
            if(gameData.tags){
                tags = gameData.tags.split(',').map(tag => tag.trim());
            } 
            let supportedPlatforms = [];
            if(gameData.supportedPlatforms){
                supportedPlatforms = gameData.supportedPlatforms.split(',').map(supportedPlatform => supportedPlatform.trim());
            } 
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
            game.status = status;
            game.uploadDate = uploadDate;
            game.supportedPlatforms = supportedPlatforms;
            game.additionalTechnicalDescription = additionalTechnicalDescription;
            await game.save();  
            res.status(200).send(gameData);
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },

    updateGameApproval : async function(req, res){
        try{
            var userId = req.user.id;
            var user = await userModel.findById(userId);
            if(!user.isAdmin){
                res.status(401).json({ Error: "Only admins can approve a game." });
                return;
            }

            await gameModel.findByIdAndUpdate(req.params.id, {status: req.params.newStatus, publishDate: Date.now()});
            res.status(200).send("Review Successful");
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
            await deleteFile(game.downloadFileRef);
            await deleteFile(game.displayImageRef);
            Promise.all(game.additionalImagesRefs.map(async (ref) => await deleteFile(ref)));
            await game.deleteOne();
            res.status(200).send("Deleted successfully");
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },

    deleteAll : async function(req, res){
        try{
            let games = await gameModel.find();
            games.map(async (game) => {
                await deleteFile(game.downloadFileRef);
                await deleteFile(game.displayImageRef);
                Promise.all(game.additionalImagesRefs.map(async (ref) => await deleteFile(ref)));
            })
            await gameModel.deleteMany();
            await userModel.deleteMany();
            res.status(200).send("Deleted All successfully");
        }
        catch(err){
            res.status(400).json({ Error: err.message || err });
        }
    },

    gameInputValidation : function(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({checkErrors : errors.array()});
            return false;
        }
        
        if(!fileExists(req, "downloadFile") || !fileTypeMatches(req, "downloadFile", ["application/zip", "application/x-zip-compressed"])){
        
            res.status(400).json({ Error: "Download file should exists and should be of type .zip" });
            return false;
        }
        if(!fileExists(req, "displayImage") || !fileTypeMatches(req, "displayImage", ["image/jpeg","image/png"])){
        
            res.status(400).json({ Error: "Display image is required and should be of type .jpeg or .png" });
            
            return false;
        }
        if(req.files['additionalImages']){
        
            for(let i=0;i<req.files['additionalImages'].length;i++){
                if(!fileTypeMatches(req, "displayImage", ["image/jpeg","image/png"])){
                    res.status(400).json({ Error: "Additional images should be of type .jpeg or .png" });
                
                    return false;
                }
            }
        }  
        
        return true;
    },

    gameInputChecks : [check('name', "The name of the game should be 3-15 characters long.")
    .exists()
    .isLength({min: 3, max: 15}),

    check('price', "Price should exist, be a number and be greater than 0.")
    .exists()
    .isNumeric()
    .custom(value => {
        return value >= 0;
    }),

    check('genre', "A game should have a genre. Between 2-15 characters.")
    .exists()
    .isLength({min: 2, max: 15})],

    gamePurchase : async function(req, res){
        try{
            var game = await gameModel.findById(req.params.id);
            var user = await userModel.findById(req.user.id);
            if(user.gamesPurchasedIds.includes(game.id)){
                res.status(400).json({ Error: "You have already purchased this game." });
                return;
            }
            if(user.gamesOwnedIds.includes(game.id)){
                res.status(400).json({ Error: "You can't purchase your own game." });
                return;
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer_email: user.email,
                line_items: [{
                    price_data:{
                        currency: 'cad',
                        product_data: {
                            name: game.name
                        },
                        unit_amount: game.price * 100
                    },
                    quantity: 1
                }],
                metadata: {
                    gameId : game.id
                },
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}/game-info/${game.id}`,
                cancel_url: `${process.env.CLIENT_URL}/game-info/${game.id}`
            });
            //user.gamesPurchasedIds.push(game.id);
            //await user.save();
            res.json(session.url);
        }
        catch(error){
            res.status(400).json({ Error: error })
        }   
    },

    stripeWebhook : async function(req, res){
        const event = req.body;

        console.log(JSON.stringify(event));
        console.log(JSON.stringify(event.data.object.metadata));
        res.json({received: true});
        return;
        // Handle the event
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const email = paymentIntent.receipt_email;
            const user = await userModel.findOne({email: email});
            if(!user){
                console.log("Can't find user");
                break;
            }
            const gameId = paymentIntent.metadata.gameId;
            if(!gameId){
                console.log("Game id not found.");
                break;
            }
            user.gamesPurchasedIds.push(gameId);
            await user.save();
            console.log('PaymentIntent was successful!');
            break;
          default:
            break;
        }
      
        // Return a 200 response to acknowledge receipt of the event
        res.json({received: true});
    },

    gameDownload : async function(req, res){
        try{
            var game = await gameModel.findById(req.params.id);
            var user = await userModel.findById(req.user.id);
            if(!user.isAdmin && !user.gamesPurchasedIds.includes(game.id) && !user.gamesOwnedIds.includes(game.id)){
                res.status(400).json({ Error: "You have not purchased this game yet." });
                return;
            }

            const url = await getFileURL(game.downloadFileRef); //get url from aws s3;
            res.status(200).send(url)

        }
        catch(error){
            res.status(400).json({ Error: error })
        }   
    },

    gameDownloadFree : async function(req, res){
        try{
            var game = await gameModel.findById(req.params.id);
            if(game.price != 0){
                res.status(400).json({ Error: "The requested game is not free." })
                return;
            }

            const url = await getFileURL(game.downloadFileRef); //get url from aws s3;
            res.status(200).send(url)
        }
        catch(error){
            res.status(400).json({ Error: error })
        }       
    }

}

function fileTypeMatches(req, fieldName, acceptedFileTypes ){

    var file = req.files[fieldName];
    if(!file){
        return false;
    }

    if(!acceptedFileTypes.includes(file[0].mimetype)){
        return false;
    }

    return true;
}

function fileExists(req, fieldName){

    if(!req.files[fieldName]){
        return false;
    }

    return true;
}

//for testing
async function getImageURL(imageRef){
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageRef 
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, {expiresIn: 600});
    return url;
}

async function getFileURL(fileRef){
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileRef 
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, {expiresIn: 600});
    return url;
}

async function processFile(file){
    if(file == null){
        return null;
    }
    file.buffer = await fs.readFile(file.path);
    return file;
}

async function processImage(file){
    if(file == null){
        return null;
    }

    file.buffer = await sharp(file.path).resize({height: 500, width: 500, fit: 'contain'}).toBuffer();
    return file;
}

async function saveFile(file){
    if(file == null){
        return null;
    }    
    const randomName = randomFileName();
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.BUCKET_NAME,
            Key: randomName,
            Body: file.buffer,
            ContentType: file.mimetype
        }
      });
    
      await upload.done();
    return randomName;
}
async function updateFile(file, fileRef){
    if(file == null){
        return null;
    }    
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.BUCKET_NAME,
            Key: fileRef,
            Body: file.buffer,
            ContentType: file.mimetype
        }
      });
    
      await upload.done();
    return fileRef;
}
async function updateImage(image, imageRef){
    if(image == null){
        return null;
    }
    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageRef,
        Body: image.buffer,
        ContentType: image.mimetype
    }
    let command = new PutObjectCommand(params);
    await s3.send(command);
    return imageRef;
}

async function saveImage(image){
    if(image == null){
        return null;
    }
    const randomName = randomFileName();
    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: randomName,
        Body: image.buffer,
        ContentType: image.mimetype
    }
    let command = new PutObjectCommand(params);
    await s3.send(command);
    return randomName;
}

async function deleteFile(fileRef){
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileRef
    }

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
}