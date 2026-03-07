const mongoose = require('mongoose');

const connectDatabase = async()=>{
    try{
        console.log(process.env.DATABASE_URI)
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Database connected successfully!")
    }
    catch(err){
        console.log("Somting went wrong to connect database", err.message)
        process.exit(1)
    }
}
module.exports = connectDatabase