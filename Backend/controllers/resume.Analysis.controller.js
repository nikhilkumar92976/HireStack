const {generateResumeAnalysisReport,generateResumePdf} = require('../services/ai.service')
const resumeAnalysisModel = require('../models/resume.Analysis.model')
const pdfParse = require("pdf-parse")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateResumeAnalysisController = async(req,res)=>{
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription ,title } = req.body
 

    const resumeAnalysisByAi = await generateResumeAnalysisReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })
    // console.log("resumeAnalysisByAi",resumeAnalysisByAi )

    let aiResult = resumeAnalysisByAi

    aiResult.technicalQuestions = convertToObjects(
    aiResult.technicalQuestions,
    ["question", "intention", "answer"]
    )

    aiResult.behavioralQuestions = convertToObjects(
    aiResult.behavioralQuestions,
    ["question", "intention", "answer"]
    )

    aiResult.skillGaps = convertToObjects(
    aiResult.skillGaps,
    ["skill", "severity"]
    )

    aiResult.preparationPlan = convertToObjects(
    aiResult.preparationPlan,
    ["day", "focus", "tasks"] 
    ) 

    console.log("AI-result",aiResult)
    const resumeAnalysis = await resumeAnalysisModel.create({
        user: req.userId,
        title ,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...aiResult
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        resumeAnalysis
    })
}

function convertToObjects(arr, keys) {
  const result = []

  for (let i = 0; i < arr.length; i += keys.length) {
    const obj = {}

    keys.forEach((key, index) => {
      obj[key] = arr[i + index]
    })

    result.push(obj)
  }

  return result
}

/**
 * @description Controller to getting a resume analysis by id
 */ 

const getResumeAnalysisByIdController = async(req,res)=>{
    try{
        const analysisId = req.params.id;
        const resumeAnalysisResult = await resumeAnalysisModel.findById({_id:analysisId})

        return res.status(200).json({
            message:"resume analysis resume successfully",
            resumeAnalysisResult
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Somting went wrong!"
        })
    }
}

/**
 * @description Controller to getting a user all resume analysis 
 */ 

const getUserResumeAnalysisController = async(req,res)=>{
    try{
        const previousAnalysis = await resumeAnalysisModel
            .find({ user: req.userId })
            // .select("title jobDescription matchScore");

        return res.status(200).json({
            message:"user resume analysis featched successfully",
            previousAnalysis
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"somthing went wrong!"
        })
    }
}

/**
 * @description Controller to generating resume by AI
 */ 

const generateResumeByAI= async(req,res)=>{
    try{
        const {name, email, phone, location, github, linkedin, summary,skills,workHistory,projects,education,Achievements,HonorsAndAwards,jobDescription}= req.body;

        const resumePdfBuffer = await generateResumePdf({
            name, email, phone, location, github, linkedin, summary,skills,workHistory,projects,education,Achievements,HonorsAndAwards,jobDescription
        })

        // Send the PDF directly as the response (for download in browser/client)
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", "attachment; filename=resume.pdf")
        return res.status(200).send(resumePdfBuffer)

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


module.exports = {
    generateResumeAnalysisController,
    getResumeAnalysisByIdController,
    getUserResumeAnalysisController,
    generateResumeByAI
}