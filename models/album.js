const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const albumSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    required: true,
  },
  admin_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: "artist",
    required: true,
  },
});

module.exports = mongoose.model("album", albumSchema); 
