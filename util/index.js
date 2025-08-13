const bcrypt = require("bcrypt")
const jwt =require("jsonwebtoken")
const hashPassword = async (password) => {
    let hashPass = await bcrypt.hash(password, 10)
    console.log("hashPass", hashPass)
    return hashPass
}
const comparePassword = async (password, hashPassword) => {
    console.log(password, "password", hashPassword)
    let response = await bcrypt.compare(password, hashPassword)
    //console.log("response",response)
    return response
}

const createToken= (data)=>{
  let token=  jwt.sign(data,process.env.SECRET_KEY,{expiresIn:"36h"})
//   console.log("token",token)
  return token
}   
const verifyToken=(req,res,next)=>{
    try{
        let token=req.headers["authorization"]
        if(!token){
            res.status(401).send({message:"unAuthorised"})
        }
        token=token.replace("Bearer ","")
        console.log(token,"token verifyToken")

        const decode=  jwt.verify(token,process.env.SECRET_KEY)
        console.log("decode",decode)
        req.user=decode
        next()
        // return decode
    }catch(err){
        console.log("err",err)
        res.status(401).send({message:"unAuthorised"})
        return false
    }
}
module.exports = {
    hashPassword,
    comparePassword,
    verifyToken,
    createToken
}