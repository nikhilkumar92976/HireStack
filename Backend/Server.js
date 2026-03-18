const express = require('express');
const app = express()
require('dotenv').config()
const connectDatabase = require('./config/connect.database')
const cookieParser = require('cookie-parser')
const cors = require('cors')


//imports routes
const authRouter = require('./routes/auth.route')
const resumeAnalysisRouter = require('./routes/resume.Analysis.route')
const interviewQuestionRouter = require('./routes/interview.route')

const PORT = process.env.PORT || 3000

//connecting to databse
connectDatabase();

//adding middlewares
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
})) 
 

//using all routes
app.use('/auth',authRouter);
app.use('/resume',resumeAnalysisRouter)
app.use('/interview',interviewQuestionRouter)

app.listen(PORT,(req,res)=>{
    console.log(`APP is Listen on the PORT Number ${PORT}`)
})