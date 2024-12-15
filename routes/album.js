const express = require("express");
const { body } = require("express-validator");
const albumController = require("../controllers/album");
const router = express.Router();

router.get("/albums", albumController.getAlbums);

router.get("/albums/:id", albumController.getAlbum);

router.post("/albums/add-album", [body("artist_id").notEmpty().withMessage("Artist Id is missing"), body("name").notEmpty().withMessage("Name is missing"), body("year").notEmpty().withMessage("Year is missing"), body("hidden").notEmpty().withMessage("Hidden is missing")], albumController.addAlbum);

router.put("/albums/:id", albumController.updateAlbum);

router.delete("/albums/:id", albumController.deleteAlbum);

module.exports = router;
