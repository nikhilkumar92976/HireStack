const interviewModel = require('../models/interview.model')
const { generateInterviewQuestion, generateInterviewScore } = require('../services/ai.service')

const interviewQuestionController = async (req, res) => {
    try {
        const { jobTitle, selfDescription, jobDescription } = req.body;

        if (!jobTitle || !jobDescription || !selfDescription) {
            return res.status(400).json({ message: "All fields required" });
        }

        const interviewQuestionsRespons = await generateInterviewQuestion({ jobTitle, selfDescription, jobDescription })

        const interviewQuestion = await interviewModel.create({
            user: req.userId,
            title: jobTitle,
            technicalQuestions: interviewQuestionsRespons,
            status: "pending"
        })

        return res.status(200).json({
            success: true,
            message: "Interview question generate successfully",
            interviewQuestion,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Somting went wrong ${err.message}`
        })
    }
}

const interviewScoreController = async (req, res) => {
    try {
        const { responses } = req.body;
        const interviewId = req.params.interview;
        // console.log("interviewId : ",interviewId)
        if(!responses || responses.length === 0){
            return res.status(400).json({
                message:"Insufficent data"
            })
        }
        const interview = await interviewModel.findById(interviewId) 
        // console.log(interview)
        if(!interview){
            return res.status(404).json({
                message:"Interview not found"
            })
        }

        const report = await generateInterviewScore({ 
            jobTitle:interview.jobTitle, 
            jobDescription:interview.jobDescription,
            responses
        });

        interview.matchScore.interviewScore = report.interviewScore
        interview.matchScore.feedback = report.feedback
        interview.matchScore.strengths = report.strengths
        interview.matchScore.improvements = report.improvements 
        interview.status = "completed" 

        await interview.save()

        return res.status(200).json({
            success:true,
            message:"Interview Completed",
            interview
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Somting went wrong"
        })
    }
}


module.exports = { interviewQuestionController , interviewScoreController}