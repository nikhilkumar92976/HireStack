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
const jonSearchRouter = require('./routes/jobSearch.route')
const botRouter = require('./routes/bot.route')

const PORT = process.env.PORT || 3000

const corsOptions = {
    origin: true,
    credentials:true
}
app.use(cors(corsOptions));


//connecting to databse
connectDatabase(); 

//adding middlewares
app.use(cookieParser())
app.use(express.json())


//using all routes
app.use('/auth',authRouter);
app.use('/resume',resumeAnalysisRouter)
app.use('/interview',interviewQuestionRouter)
app.use('/job-search',jonSearchRouter)
app.use('/ai',botRouter)


app.listen(PORT,(req,res)=>{
    console.log(`APP is Listen on the PORT Number ${PORT}`)
})
