const router =require("express")
const employeeRouter=router()

employeeRouter.post("/create")
employeeRouter.post("/update")
// clientRouter.post("/login")

 module.exports=employeeRouter