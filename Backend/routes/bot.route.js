const express = require('Express');
const router = express.Router();

//import middlewares
const authMiddlewares = require('../middlewares/auth.middlewares')


/** 
 * @route POST /ai/chat
 * @description chat with hirestack ai and get solution
 * @access private
 */
const botController = require('../controllers/bot.controller');


router.post('/chat',authMiddlewares, botController);

module.exports = router;