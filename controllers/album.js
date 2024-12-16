const { validationResult } = require("express-validator");
const Album = require("../models/album");
const Artist = require("../models/artist");

exports.getAlbums = (req, res, next) => {
  const adminId = req.admin_id;
  const hidden = req.query.hidden;
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;
  const artistId = req.query.artist_id;

  const filters = {
    admin_id: adminId,
  };
  if (hidden) {
    filters.hidden = hidden;
  }
  if (artistId) {
    Artist.findById(artistId)
      .then((artist) => {
        if (!artist) {
          return res.status(404).json({ status: 404, data: null, message: "Artist not found.", error: null });
        }
        if (artist.admin_id.toString() != adminId) {
          return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
        }
        filters.artist_id = artistId;
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 400;
          err.message = "Bad request."
        }
        next(err);
      });
  }

  Album.find(filters)
    .limit(limit)
    .skip(offset)
    .populate({
      path: "artist_id",
      select: "name",
    })
    .then((albums) => {
      const formattedAlbums = albums.map((album) => ({
        album_id: album._id,
        name: album.name,
        year: album.year,
        artist_name: album.artist_id.name,
        hidden: album.hidden,
      }));
      return res.status(200).json({ status: 200, data: formattedAlbums, message: "Albums retrieved successfully.", error: null });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 400;
        err.message = "Bad request."
      }
      next(err);
    });
};

exports.getAlbum = (req, res, next) => {
  const adminId = req.admin_id;
  const albumId = req.params.id;

  Album.findById(albumId)
    .populate({
      path: "artist_id",
      select: "name",
    })
    .then((album) => {
      if (!album) {
        return res.status(404).json({ status: 404, data: null, message: "Album not found.", error: null });
      }
      if (adminId !== album.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      const formattedAlbum = {
        album_id: album._id,
        name: album.name,
        year: album.year,
        artist_name: album.artist_id.name,
        hidden: album.hidden,
      };
      return res.status(200).json({ status: 200, data: formattedAlbum, message: "Album retrieved successfully.", error: null });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 400;
        err.message = "Bad request."
      }
      next(err);
    });
};

exports.addAlbum = (req, res, next) => {
  const adminId = req.admin_id;

  const artistId = req.body.artist_id;
  const name = req.body.name;
  const year = parseInt(req.body.year);
  const hidden = req.body.hidden;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let reason = "";
    errors.array().map((e) => {
      reason += e.msg;
      reason += ", ";
    });
    return res.status(400).json({ status: 400, data: null, message: `Bad Request, Reason: ${reason} `, error: null });
  }

  Artist.findById(artistId)
    .then((artist) => {
      if (!artist) {
        return res.status(404).json({ status: 404, data: null, message: "artist not found.", error: null });
      }
      if (adminId !== artist.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      const newAlbum = new Album({
        admin_id: adminId,
        artist_id: artistId,
        name,
        year,
        hidden,
      });
      newAlbum
        .save()
        .then((result) => {
          return res.status(201).json({ status: 201, data: null, message: "Album created successfully.", error: null });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 400;
        err.message = "Bad request."
      }
      next(err);
    });
};

exports.updateAlbum = (req, res, next) => {
  const adminId = req.admin_id;

  const albumId = req.params.id;
  const name = req.body.name;
  const year = req.body.year;
  const hidden = req.body.hidden;

  Album.findById(albumId)
    .then((album) => {
      if (!album) {
        return res.status(404).json({ status: 404, data: null, message: "Album not found.", error: null });
      }
      if (album.admin_id.toString() !== adminId) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      Album.findByIdAndUpdate(albumId, { name, year, hidden })
        .then((album) => {
          return res.status(204).json({ status: 204, data: null, message: "Album updated successfully.", error: null });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 400;
        err.message = "Bad request."
      }
      next(err);
    });
};

exports.deleteAlbum = (req, res, next) => {
  const adminId = req.admin_id;

  const albumId = req.params.id;

  Album.findById(albumId)
    .then((album) => {
      if (!album) {
        return res.status(404).json({ status: 404, data: null, message: "Album not found.", error: null });
      }
      if (album.admin_id.toString() !== adminId) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      Album.findByIdAndDelete(albumId)
        .then((album) => {
          return res.status(200).json({ status: 200, data: { album_id: album._id }, message: `Album: ${album.name} deleted successfully.`, error: null });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 400;
        err.message = "Bad request."
      }
      next(err);
    });
};
