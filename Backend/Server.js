const express = require('express');
const app = express()
require('dotenv').config()
const connectDatabase = require('./config/connect.database')
const cookieParser = require('cookie-parser')
const cors = require('cors')


//imports routes
const authRoute = require('./routes/auth.route')

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
app.use('/auth',authRoute);

app.listen(PORT,(req,res)=>{
    console.log(`APP is Listen on the PORT Number ${PORT}`)
})