const express = require('express')
const router = express.Router()

//import middlewares
const authMiddlewares = require('../middlewares/auth.middlewares')


//import controllers
const authController = require('../controllers/auth.controller')


//Routs for Auth
router.post('/singup',authController.createAccount); // intregated
router.post('/login',authController.login) // intregated
router.post('/logout',authMiddlewares,authController.userLogout) // intregated

router.delete('/delete/account',authMiddlewares,authController.deleteAccount)
router.patch('/updatepassword',authMiddlewares,authController.updateUserPassword)
router.get('/profile',authMiddlewares,authController.getUserAccount)
router.patch('/updateprofile',authMiddlewares,authController.updateUserProfile)

module.exports = router