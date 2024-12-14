const express = require("express");
const { body } = require("express-validator");
const artistController = require("../controllers/artist");

const router = express.Router();

router.get("/artists", artistController.getArtists);

router.get("/artists/:id", artistController.getArtist);

router.post("/artists/add-artist", [body("name").notEmpty().withMessage("Name is missing"), body("grammy").notEmpty().withMessage("Grammy is missing"), body("hidden").notEmpty().withMessage("Hidden is missing")], artistController.addArtist);

router.put("/artists/:id",artistController.updateArtist);

router.delete("/artists/:id",artistController.deleteArtist);

module.exports = router;
