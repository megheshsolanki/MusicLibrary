const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const trackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    hidden: {
        type: Boolean,
        required: true
    },
    admin_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artist_id:{
        type: Schema.Types.ObjectId,
        ref: 'artist',
        required: true
    },
    album_id:{
        type: Schema.Types.ObjectId,
        ref: 'album',
        required: true
    }
});

module.exports = mongoose.model("track",trackSchema);