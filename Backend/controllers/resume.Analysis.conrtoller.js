const {generateResumeAnalysisReport} = require('../services/ai.service')
const {resumeAnalysisModel} = require('../models/resume.Analysis.model')
const pdfParse = require("pdf-parse")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateResumeAnalysisController = async(req,res)=>{
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body


    console.log("selfDescription: ",selfDescription)
    console.log("jobDescription: ",jobDescription)
    console.log("resumeContent: ",resumeContent)
    const resumeAnalysisByAi = await generateResumeAnalysisReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const resumeAnalysis = await resumeAnalysisModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...resumeAnalysisByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        resumeAnalysis
    })
}

module.exports = {
    generateResumeAnalysisController
}