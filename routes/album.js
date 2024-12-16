const express = require("express");
const { body } = require("express-validator");
const albumController = require("../controllers/album");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const isNotViewer = require("../middlewares/isNotViewer");

router.get("/albums",isAuthenticated, albumController.getAlbums);

router.get("/albums/:id",isAuthenticated, albumController.getAlbum);

router.post("/albums/add-album",isAuthenticated,isNotViewer, [body("artist_id").notEmpty().withMessage("Artist Id is missing"), body("name").notEmpty().withMessage("Name is missing"), body("year").notEmpty().withMessage("Year is missing"), body("hidden").notEmpty().withMessage("Hidden is missing")], albumController.addAlbum);

router.put("/albums/:id",isAuthenticated,isNotViewer, albumController.updateAlbum);

router.delete("/albums/:id",isAuthenticated,isNotViewer, albumController.deleteAlbum);

module.exports = router;
