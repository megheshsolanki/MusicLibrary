const express = require('express')
const { body } = require('express-validator')
const favouriteController = require('../controllers/favourite')
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router()

router.get('/favourites/:category',isAuthenticated,favouriteController.getFavourites)

router.post('/favourites/add-favorite',isAuthenticated,favouriteController.addFavourite)

router.delete('/favourites/remove-favourite/:id',isAuthenticated,favouriteController.deleteFavourite)

module.exports = router;