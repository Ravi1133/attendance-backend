const router =require("express")
const clientRouter=router()

clientRouter.post("/create")
clientRouter.post("/update")
// clientRouter.post("/login")

 module.exports=clientRouter