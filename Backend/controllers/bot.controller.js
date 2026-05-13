const botService = require('../services/bot.service')

const botCallHandler = async(req,res)=>{
    try{
        const {userMessage,threadId} = req.body;
        if(!userMessage || !threadId){
            return res.status(400).json({
                message:"All feilds are required!"
            })
        }

        const result = await botService(userMessage, threadId);

        return res.status(200).json({
            success:"AI response",
            AiResult: result
        })
    }
    catch(err){
        return res.status(500).json({
            message:"somthing went wrong!",
            success:false
        })
    }
}

module.exports = botCallHandler;