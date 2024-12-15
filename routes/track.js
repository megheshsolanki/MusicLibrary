const express = require("express");
const { body } = require("express-validator");
const trackController = require("../controllers/track");
const router = express.Router();

router.get("/tracks", trackController.getTracks);

router.get("/tracks/:id", trackController.getTrack);

router.post("/tracks/add-track", [body("album_id").notEmpty().withMessage("Album Id is missing"), body("artist_id").notEmpty().withMessage("Artist Id is missing"), body("name").notEmpty().withMessage("Name is missing"), body("duration").notEmpty().withMessage("Duration is missing"), body("hidden").notEmpty().withMessage("Hidden is missing")], trackController.addTrack);

router.put("/tracks/:id", trackController.updateTrack);

router.delete("/tracks/:id", trackController.deleteTrack);

module.exports = router;
