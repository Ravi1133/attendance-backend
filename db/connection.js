const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config({})

let uri=process.env.DB_URL
console.log("uri",uri)
const connection=()=>{
    mongoose.connect(uri,{
        autoIndex:true
    }).then((res)=>{
        console.log("Connected")
    }).catch(err=>{
        console.log("err",err)
        console.log("connection error")
    })
}

module.exports=connection