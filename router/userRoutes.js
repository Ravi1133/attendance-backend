const router =require("express")
const { addRole, userAdd, userLogin, markAttendence, getAllRoles, getAllUser, addClient, getClient, getAttendenceData, updateClientStatus, updateUserStatus, changePassword } = require("../controller/userController")
const { validateRole, validateUser, validateAttendence, validateClient, validateClientFetch, checkAttendanceDataSchema, validateCheckAttendence, validateCheckChangePassword } = require("../util/validators")
const { verifyToken } = require("../util")
const { addClientService, getClientService } = require("../service/userService")
const userRouter=router()

// userRouter.post("/regsiter")
// userRouter.post("/update")
// userRouter.post("/login")
userRouter.post("/addRole" ,validateRole,addRole)
userRouter.post("/addUser" ,validateUser,userAdd)
userRouter.post("/login",userLogin)
userRouter.post("/markAttendence",verifyToken,validateAttendence,markAttendence)
userRouter.post("/getAttendenceData",verifyToken,validateCheckAttendence,getAttendenceData)

userRouter.get("/getRoles",getAllRoles)
userRouter.post("/getUsers",getAllUser)
userRouter.post("/changePassword",verifyToken,validateCheckChangePassword,changePassword)

userRouter.post("/addClient",validateClient,addClient)
userRouter.post("/updateClientStatus/:id",updateClientStatus)
userRouter.post("/updateUserStatus/:id",updateUserStatus)

// userRouter.put("/updateClient",updateClient)
// userRouter.get("/updateClient",getClient)
userRouter.post("/getClient",validateClientFetch,getClient)


module.exports=userRouter