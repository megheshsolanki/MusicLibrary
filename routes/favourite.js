const express = require('express')
const { body } = require('express-validator')
const favouriteController = require('../controllers/favourite')

const router = express.Router()

router.get('/favourites/:category',favouriteController.getFavourites)

router.post('/favourites/add-favorite',favouriteController.addFavourite)

router.delete('/favourites/remove-favourite/:id',favouriteController.deleteFavourite)

module.exports = router;