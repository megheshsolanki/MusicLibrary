const { validationResult, Result } = require("express-validator");
const Track = require("../models/track");
const Artist = require("../models/artist");
const Album = require("../models/album");

exports.getTracks = (req, res, next) => {
  const adminId = req.query.admin_id; // fetch from token

  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;
  const albumId = req.query.album_id;
  const artistId = req.query.artist_id;
  const hidden = req.query.hidden;

  const filters = {
    admin_id: adminId,
  };
  if (hidden) filters.hidden = hidden;
  if (albumId) {
    Album.findById(albumId)
      .then((album) => {
        if (!album) {
          return res.status(404).json({ status: 404, data: null, message: "Album not found.", error: null });
        }
        if (adminId !== album.admin_id.toString()) {
          return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
        }
        filters.album_id = albumId;
      })
      .catch((err) => {
        console.log(err);
      });
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
        console.log(err);
      });
  }
  Track.find(filters)
    .limit(limit)
    .skip(offset)
    .populate({
      path: "album_id",
      select: "name",
    })
    .populate({
      path: "artist_id",
      select: "name",
    })
    .then((tracks) => {
      const formattedTracks = tracks.map((track) => ({
        _id: track._id,
        name: track.name,
        duration: track.duration,
        hidden: track.hidden,
        admin_id: track.admin_id,
        album_name: track.album_id.name,
        artist_name: track.artist_id.name,
      }));
      return res.status(200).json({ status: 200, data: formattedTracks, message: "Tracks retrieved successfully.", error: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getTrack = (req, res, next) => {
  const adminId = req.query.admin_id; // fetch from token

  const trackId = req.params.id;

  Track.findById(trackId)
    .populate({
      path: "album_id",
      select: "name",
    })
    .populate({
      path: "artist_id",
      select: "name",
    })
    .then((track) => {
      if (!track) {
        return res.status(404).json({ status: 404, data: null, message: "Track not found.", error: null });
      }
      if (adminId !== track.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      const formattedTrack = {
        _id: track._id,
        name: track.name,
        duration: track.duration,
        hidden: track.hidden,
        admin_id: track.admin_id,
        album_name: track.album_id.name,
        artist_name: track.artist_id.name,
      }
      return res.status(200).json({ status: 200, data: formattedTrack, message: "Track retrieved successfully.", error: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addTrack = (req, res, next) => {
  const adminId = req.query.admin_id; // fetch from token
  // role check

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let reason = "";
    errors.array().map((e) => {
      reason += e.msg;
      reason += ", ";
    });
    return res.status(400).json({ status: 400, data: null, message: `Bad Request, Reason: ${reason} `, error: null });
  }

  const artistId = req.body.artist_id;
  const albumId = req.body.album_id;
  const name = req.body.name;
  const duration = req.body.duration;
  const hidden = req.body.hidden;

  Album.findById(albumId)
    .then((album) => {
      if (!album) {
        return res.status(404).json({ status: 404, data: null, message: "Album not found.", error: null });
      }
      if (album.admin_id.toString() !== adminId || album.artist_id.toString() !== artistId) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      Artist.findById(artistId)
        .then((artist) => {
          if (!artist) {
            return res.status(404).json({ status: 404, data: null, message: "artist not found.", error: null });
          }
          if (adminId !== artist.admin_id.toString()) {
            return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
          }
          const newTrack = new Track({
            admin_id: adminId,
            artist_id: artistId,
            album_id: albumId,
            name,
            duration,
            hidden,
          });
          newTrack
            .save()
            .then((result) => {
              return res.status(201).json({ status: 201, data: null, message: "Track created successfully.", error: null });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateTrack = (req, res, next) => {
  const adminId = req.query.admin_id; // fetch from token
  // role-check

  const trackId = req.params.id;
  const name = req.body.name;
  const duration = req.body.duration;
  const hidden = req.body.hidden;

  Track.findById(trackId)
    .then((track) => {
      if (!track) {
        return res.status(404).json({ status: 404, data: null, message: "Track not found.", error: null });
      }
      if (track.admin_id.toString() !== adminId) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      Track.findByIdAndUpdate(trackId, { name, duration, hidden })
        .then((result) => {
          return res.status(204).json({ status: 204, data: null, message: "Track updated successfully.", error: null });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteTrack = (req, res, next) => {
  const adminId = req.query.admin_id; // fetch from token
  // role-check
  const trackId = req.params.id;

  Track.findById(trackId)
    .then((track) => {
      if (!track) {
        return res.status(404).json({ status: 404, data: null, message: "Track not found.", error: null });
      }
      if (track.admin_id.toString() !== adminId) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      }
      Track.findByIdAndDelete(trackId)
        .then((result) => {
          return res.status(200).json({ status: 200, data: { track_id: result._id }, message: `Track: ${result.name} deleted successfully.`, error: null });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
