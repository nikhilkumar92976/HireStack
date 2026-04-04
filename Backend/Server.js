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

const PORT = process.env.PORT || 3000
const defaultOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '')
const isLocalDevOrigin = (origin = '') => /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(normalizeOrigin).filter(Boolean)
    : defaultOrigins

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

//connecting to databse
connectDatabase(); 

//adding middlewares
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const normalizedOrigin = normalizeOrigin(origin)

        if (!origin || allowedOrigins.includes(normalizedOrigin) || (!process.env.CORS_ORIGINS && isLocalDevOrigin(normalizedOrigin))) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
})) 
 

//using all routes
app.use('/auth',authRouter);
app.use('/resume',resumeAnalysisRouter)
app.use('/interview',interviewQuestionRouter)
app.use('/job-search',jonSearchRouter)

app.listen(PORT,(req,res)=>{
    console.log(`APP is Listen on the PORT Number ${PORT}`)
})