const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const artistSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    grammy:{
        type: Number,
        required: true,
    },
    hidden:{
        type: Boolean,
        required: true,
    },
    admin_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model("Artist", artistSchema); 
