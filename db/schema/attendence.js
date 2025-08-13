const mongoose=require("mongoose")
const { attendenceTypeEnum, attendenceStatusEnum, shiftEnum } = require("../../util/constant")

const attendenceSchema= mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"user"
    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"client"
    },
    date:{
        type:String,
        require:true
    },
    AttendanceType:{
        type:String,
        require:true,
        enum:attendenceTypeEnum
    },
    shift:{
        type:String,
        require:true,
        enum:shiftEnum
    },
    status:{
        type:String,
        require:true,
        enum:attendenceStatusEnum
    },
    markedBy:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"user"
    }
})  

const attendenceModel=mongoose.model("attendence",attendenceSchema)
module.exports=attendenceModel