const express = require('express')
const router = express.Router()

//import middlewares
const authMiddlewares = require('../middlewares/auth.middlewares')


//import controllers
const authController = require('../controllers/auth.controller')


//Routs for Auth

/** 
 * @route POST /auth/singup
 * @description for creating new account with new username and email id
 * @access public
 */
router.post('/singup',authController.createAccount); // intregated


/** 
 * @route POST /auth/login
 * @description for login user 
 * @access public
 */
router.post('/login',authController.login) // intregated


/** 
 * @route POST /auth/logout
 * @description for user logout by removing token but token blacklisting is painding 
 * @access private
 */
router.post('/logout',authMiddlewares,authController.userLogout) // intregated



/** 
 * @route POST /auth/delete/account
 * @description delete user account
 * @access private
 */
router.delete('/delete/account',authMiddlewares,authController.deleteAccount)

/** 
 * @route POST /auth/updatepassword
 * @description update user account password
 * @access private
 */
router.patch('/updatepassword',authMiddlewares,authController.updateUserPassword)

/** 
 * @route POST /auth/profile
 * @description see user account
 * @access private
 */
router.get('/profile',authMiddlewares,authController.getUserAccount)

/** 
 * @route POST /auth/updateprofile
 * @description update user profile
 * @access private
 */
router.patch('/updateprofile',authMiddlewares,authController.updateUserProfile)

module.exports = router