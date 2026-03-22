const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    try{
        const cookieToken = req.cookies?.token;
        const authHeader = req.headers.authorization || "";
        const headerToken = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const token = cookieToken || headerToken;

        if(!token){
            return res.status(401).json({
                message:"Unautorized access"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.userId = decoded.id;

        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Somting went wrong"
        })
    }
}


module.exports = auth;