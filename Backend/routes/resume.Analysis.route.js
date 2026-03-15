const express = require('express');
const resumeAnalysisRouter = express.Router()

const authMiddleware = require('../middlewares/auth.middlewares');
const upload = require('../middlewares/file.middleware')
const resumeAnalysisController = require('../controllers/resume.Analysis.controller')

/**
 * @route POST /resume/
 * @description generate new resume analysis report on the basis of user self description,resume pdf and job description.
 * @access private
 */

resumeAnalysisRouter.post('/',authMiddleware,upload.single("resume"),resumeAnalysisController.generateResumeAnalysisController)


/** 
 * @route POST /resume/:id
 * @description getting a resume analysis by id
 * @access private
 */
resumeAnalysisRouter.get('/:id',authMiddleware,resumeAnalysisController.getResumeAnalysisByIdController)

/**
 * @route POST /resume/
 * @description getting a user all  resume analysis 
 * @access private
 */
resumeAnalysisRouter.get('/',authMiddleware,resumeAnalysisController.getUserResumeAnalysisController)

/**
 * @route POST /resume/create-resume
 * @description create resume using AI
 * @access private
 */
resumeAnalysisRouter.post('/create-resume',authMiddleware,resumeAnalysisController.generateResumeByAI)


module.exports = resumeAnalysisRouter