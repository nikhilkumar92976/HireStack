const express = require('express');
const jonSearchRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const jobSearchController = require('../controllers/jobSearch.controller');


/** 
 * @route POST /job-search/jobs
 * @description get tech jobs
 * @access private
 */
jonSearchRouter.get('/jobs',authMiddleware, jobSearchController.getTechJobs);

module.exports = jonSearchRouter;
