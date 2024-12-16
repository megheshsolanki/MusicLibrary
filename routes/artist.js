const express = require("express");
const { body } = require("express-validator");
const artistController = require("../controllers/artist");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isNotViewer = require("../middlewares/isNotViewer");

const router = express.Router();

router.get("/artists",isAuthenticated, artistController.getArtists);

router.get("/artists/:id",isAuthenticated, artistController.getArtist);

router.post("/artists/add-artist",isAuthenticated,isNotViewer, [body("name").notEmpty().withMessage("Name is missing"), body("grammy").notEmpty().withMessage("Grammy is missing"), body("hidden").notEmpty().withMessage("Hidden is missing")], artistController.addArtist);

router.put("/artists/:id",isAuthenticated,isNotViewer, artistController.updateArtist);

router.delete("/artists/:id",isAuthenticated,isNotViewer, artistController.deleteArtist);

module.exports = router;
