const mongoose = require('mongoose')

const interviewQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
})
const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    technicalQuestions: [interviewQuestionSchema], // array of questions
    matchScore :{
        interviewScore:Number,
        feedback:String,
        strengths:[String],
        improvements:[String]
    },
    status:{
        type:String,
        enum:["pending","completed"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Report", reportSchema)