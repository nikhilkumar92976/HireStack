const express = require('express');
const resumeAnalysisRouter = express.Router()

const authMiddleware = require('../middlewares/auth.middlewares');
const upload = require('../middlewares/file.middleware')
const resumeAnalysisController = require('../controllers/resume.Analysis.conrtoller')

/**
 * @route POST /resume/
 * @description generate new resume analysis report on the basis of user self description,resume pdf and job description.
 * @access private
 */

resumeAnalysisRouter.post('/',authMiddleware,upload.single("resume"),resumeAnalysisController.generateResumeAnalysisController)


module.exports = resumeAnalysisRouter