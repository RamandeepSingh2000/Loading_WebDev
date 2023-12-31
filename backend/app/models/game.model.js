const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let game = new Schema({
    name:{
        type: String        
    },
    description:{
        type: String
    },
    downloadFileRef:{
        type: String
    },
    displayImageRef:{
        type: String
    },
    additionalImagesRefs:{
        type: [String]
    },
    price:{
        type: Number
    },
    ownerId:{
        type: String
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