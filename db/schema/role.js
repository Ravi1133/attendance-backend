const mongoose=require("mongoose")
const { resourceState } = require("../../util/constant")
const roleSchema=mongoose.Schema({

    roleName:{
        require:true,
        unique:true,
        type:String
    },
    permissions:{
        client:[{
            type:String,
            enum:resourceState   
        }],
        manager:[{
            type:String,
            enum:resourceState
        }],
        employee:[{
            type:String,
            enum:resourceState   
        }]
    }
},{
    timestamps:true
})


let roleModel= mongoose.model("role",roleSchema)
module.exports=roleModel
