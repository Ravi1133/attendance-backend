const mongoose=require("mongoose")

const clientSchema=mongoose.Schema({
        name:{
            type:String,
            require:true
        },
        
        gst:{
            type:String,
            require:false
        },
        mobile:{
            type:String,
            require:false
        },email:{
            type:String,
            unique:true,
            index:true
        },
        address:{
            type:String,
            require:true
        },pincode:{
            type:String,
            require:true
        },
        status:{
            type:String,
            default:"ACTIVE",
            enum:["ACTIVE","INACTIVE"],
            require:true
        }
})


let clientModel= mongoose.model("client",clientSchema)

module.exports=clientModel