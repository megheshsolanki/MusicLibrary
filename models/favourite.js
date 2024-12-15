const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favouriteSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["artist", "album", "track"],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item_id: {
      type: Schema.Types.ObjectId,
      refPath: "category",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('Favourite',favouriteSchema)