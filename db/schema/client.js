const mongoose=require("mongoose")

const clientSchema=mongoose.Schema({
        name:{
            type:String,
            require:true
        },
        
        gst:{
            type:String,
            require:true
        },
        mobile:{
            type:String,
            
            require:true
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
        }
})


let clientModel= mongoose.model("client",clientSchema)

module.exports=clientModel