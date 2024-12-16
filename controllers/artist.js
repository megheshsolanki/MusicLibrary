const { validationResult } = require("express-validator");
const Artist = require("../models/artist");

exports.getArtists = (req, res, next) => {
  const adminId = req.admin_id; 
  const grammy = parseInt(req.query.grammy) ;
  const hidden = req.query.hidden;
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;

  const filters = {
    admin_id: adminId,
  };
  if(grammy){
    filters.grammy = { $gte: grammy }
  }
  if(hidden){
    filters.hidden = hidden
  }
  Artist.find(filters)
    .limit(limit)
    .skip(offset)
    .then((artists) => {
      return res.status(200).json({ status: 200, data: artists, message: "Artists retrieved successfully.", error: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addArtist = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let reason = "";
    errors.array().map((e) => {
      reason += e.msg;
      reason += ", ";
    });
    return res.status(400).json({ status: 400, data: null, message: `Bad Request, Reason: ${reason} `, error: null });
  }

  const adminId = req.admin_id; 

  const name = req.body.name;
  const grammy = req.body.grammy;
  const hidden = req.body.hidden;

  const newArtist = new Artist({
    admin_id: adminId,
    name: name,
    grammy: grammy,
    hidden: hidden,
  });

  newArtist
    .save()
    .then((result) => {
      return res.status(201).json({ status: 201, data: null, message: "Artists created successfully.", error: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getArtist = (req, res, next) => {
  const adminId = req.admin_id; 
  const artistId = req.params.id;

  Artist.findById(artistId)
    .then((artist) => {
      if (!artist) {
        return res.status(404).json({ status: 404, data: null, message: "Artist not found.", error: null });
      }
      if (adminId !== artist.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      return res.status(200).json({ status: 200, data: artist, message: "Artist retrieved successfully.", error: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateArtist = (req, res, next) => {
  const adminId = req.admin_id; 
  const artistId = req.params.id;
  const name = req.body.name;
  const grammy = req.body.grammy;
  const hidden = req.body.hidden;

  
  Artist.findById(artistId)
    .then((artist) => {
      if (!artist) {
        return res.status(404).json({ status: 404, data: null, message: "Artist not found.", error: null });
      }
      if (adminId !== artist.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      
      Artist.findByIdAndUpdate(artistId, {name,grammy,hidden})
        .then((result) => {
          return res.status(204).json({ status: 204, data: null, message: "Artist updated successfully.", error: null });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteArtist = (req, res, next) => {
  const adminId = req.admin_id; 
  const artistId = req.params.id;


  Artist.findById(artistId)
    .then((artist) => {
      if (!artist) {
        return res.status(404).json({ status: 404, data: null, message: "Artist not found.", error: null });
      }
      if (adminId !== artist.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      Artist.findByIdAndDelete(artistId)
        .then((result) => {
          return res.status(200).json({ status: 200, data: {artist_id: result._id}, message: `Artist: ${result.name}  deleted successfully.`, error: null });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
