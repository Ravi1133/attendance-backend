const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
        name:{
            type:String,
            require:true
        },
        roleId:{
            type:String,
            ref:"role",
            require:true
        },
        password:{
            type:String,
            require:true
        },
        adhar:{
            type:String,
            unique:true,
            index:true,
            require:true
        },
        pan:{
            type:String,
        },
        mobile:{
            type:String,
            
            require:true
        },email:{
            type:String,
        },
        address:{
            type:String,
            require:true
        },pincode:{
            type:String,
            require:true
        },dob:{
            type:String,
            require:true
        }
})


let userModel= mongoose.model("user",userSchema)
const deleteMany=async()=>{
   let data= await userModel.deleteMany({})
    console.log("data",data)
}
// deleteMany()
module.exports=userModel