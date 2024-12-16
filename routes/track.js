const express = require("express");
const { body } = require("express-validator");
const trackController = require("../controllers/track");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const isNotViewer = require("../middlewares/isNotViewer");

router.get("/tracks",isAuthenticated, trackController.getTracks);

router.get("/tracks/:id",isAuthenticated, trackController.getTrack);

router.post("/tracks/add-track",isAuthenticated,isNotViewer, [body("album_id").notEmpty().withMessage("Album Id is missing"), body("artist_id").notEmpty().withMessage("Artist Id is missing"), body("name").notEmpty().withMessage("Name is missing"), body("duration").notEmpty().withMessage("Duration is missing"), body("hidden").notEmpty().withMessage("Hidden is missing")], trackController.addTrack);

router.put("/tracks/:id",isAuthenticated,isNotViewer, trackController.updateTrack);

router.delete("/tracks/:id",isAuthenticated,isNotViewer, trackController.deleteTrack);

module.exports = router;
