const { validationResult } = require("express-validator");
const Favourite = require("../models/favourite");
const Artist = require("../models/artist");
const Album = require("../models/album");
const Track = require("../models/track");

exports.getFavourites = (req, res, next) => {
  const userId = req.user_id; 

  const category = req.params.category;
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;

  Favourite.find({ user_id: userId, category: category })
    .limit(limit)
    .skip(offset)
    .populate({
      path: "item_id",
      select: "name",
    })
    .then((favourites) => {
      const formattedFavourites = favourites.map((favourite) => ({
        _id: favourite._id,
        category: favourite.category,
        item_id: favourite.item_id._id,
        name: favourite.item_id.name,
        createdAt: favourite.createdAt,
      }));
      return res.status(200).json({ status: 200, data: formattedFavourites, message: "Favourites retrieved successfully.", error: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addFavourite = (req, res, next) => {
  const userId = req.user_id; 
  const adminId = req.admin_id; 

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let reason = "";
    errors.array().map((e) => {
      reason += e.msg;
      reason += ", ";
    });
    return res.status(400).json({ status: 400, data: null, message: `Bad Request, Reason: ${reason} `, error: null });
  }
  const MODEL_MAP = {
    artist: Artist,
    album: Album,
    track: Track,
  };
  const category = req.body.category;
  const itemId = req.body.item_id;

  const Model = MODEL_MAP[category];
  if (!Model) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad request",
      error: null,
    });
  }
  Model.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ status: 404, data: null, message: "Item not found.", error: null });
      }
      if (adminId !== item.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      const newFav = new Favourite({
        user_id: userId,
        category,
        item_id: itemId,
      });
      Favourite.findOne({ user_id: userId, category, item_id: itemId }).then(fav=>{
        if(fav){
          return res.status(409).json({ 
            status: 409, 
            data: null, 
            message: 'Favourite already exist.', 
            error: null 
          });
        }
          newFav
            .save()
            .then((result) => {
              return res.status(201).json({ status: 201, data: null, message: "Favourite added successfully.", error: null });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      }).catch(err=>{
        console.log(err);
      })
};

exports.deleteFavourite = (req, res, next) => {
  const userId = req.user_id; 

  const favouriteId = req.params.id;

  Favourite.findById(favouriteId)
    .then((fav) => {
      if (!fav) {
        return res.status(404).json({ status: 404, data: null, message: "Favourite not found.", error: null });
      }
      if (userId !== fav.user_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      Favourite.findByIdAndDelete(favouriteId)
        .then((fav) => {
          return res.status(200).json({ status: 200, data: null, message: "Favourite removed successfully.", error: null });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
