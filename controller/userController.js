const { userRegisterService, addRoleService, userAddService, userLoginService, markAttendenceService, getAllRolesService, addClientService, getClientService, getAttendenceDataService, getAllUserService, deleteClientService, updateClientStatusService, updateUserStatusService, changePasswordService } = require("../service/userService");

const userAdd=(req,res)=>{ return userAddService(req,res)}

const addRole=(req,res)=>{return addRoleService(req,res)}
const userLogin=(req,res)=>{return userLoginService(req,res) }
const markAttendence=(req,res)=>{return markAttendenceService(req,res) }
const getAttendenceData=(req,res)=>{return getAttendenceDataService(req,res) }
const getAllRoles =(req,res)=>{return getAllRolesService(req,res)}
const getAllUser =(req,res)=>{return getAllUserService(req,res)}
const addClient =(req,res)=>{return addClientService(req,res)}
const updateClientStatus =(req,res)=>{return updateClientStatusService(req,res)}
const updateUserStatus =(req,res)=>{return updateUserStatusService(req,res)}

const changePassword =(req,res)=>{return changePasswordService(req,res) }
const getClient =(req,res)=>{return getClientService(req,res)}


module.exports={
userLogin,
    userAdd,
    addRole,
    markAttendence,
    getAllRoles,
    getAllUser,
    addClient,
    getClient,
    getAttendenceData,
    updateClientStatus,
    updateUserStatus,
    changePassword
}