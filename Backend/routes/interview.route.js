const express = require('express');
const interviewQuestionRouter = express.Router()
const authMiddleware = require('../middlewares/auth.middlewares')

const interviewQuestionController = require('../controllers/interview.controller')

/** 
 * @route POST /interview/
 * @description gnerate new interview questions
 * @access private
 */

interviewQuestionRouter.post('/',authMiddleware,interviewQuestionController.interviewQuestionController)


/** 
 * @route POST /interview/:interview
 * @description submit interview and generate result 
 * @access private
 */
interviewQuestionRouter.post('/:interview',authMiddleware,interviewQuestionController.interviewScoreController)

module.exports = interviewQuestionRouter;