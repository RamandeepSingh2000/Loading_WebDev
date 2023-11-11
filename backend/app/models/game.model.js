const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let game = new Schema({
    name:{
        type: String        
    },
    description:{
        type: String
    },
    downloadFileURL:{
        type: String
    },
    displayImageURL:{
        type: String
    },
    additionalImagesURLs:{
        type: [String]
    },
    price:{
        type: Number
    },
    ownerId:{
        type: Number
    },
    collaboratorsIds:{
        type: [Number]
    },
    uploadDate:{
        type: Date
    },
    publishDate:{
        type: Date
    },
    tags:{
        type: [String]
    },
    genre:{
        type: String
    },
    supportedPlatforms:{
        type: [String]
    },
    additionalTechnicalDescription:{
        type: String
    },
    status:{
        type: String
    }

});

module.exports = mongoose.model('game',game);