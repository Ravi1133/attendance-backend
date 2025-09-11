const { markAttendence } = require("../controller/userController")
const attendenceModel = require("../db/schema/attendence")
const clientModel = require("../db/schema/client")
const roleModel = require("../db/schema/role")
const userModel = require("../db/schema/userSchema")
const { hashPassword, comparePassword, createToken } = require("../util")

const userAddService = async (req, res) => {
    try {
        console.log(req.body, "req.body")
        let userObj = userModel({ ...req.body, password: await hashPassword("Demo@1234") })
        console.log("userObj", userObj)
        let dbResponse = await userObj.save()

        console.log("dbResponse", dbResponse)
        res.send({ message: "success" })
    } catch (err) {
        console.log(err, "error in addUser")
    }
}
const clientAddService = async (req, res) => {
    try {
        console.log(req.body, "req.body")
        let userObj = userModel({ ...req.body, password: await hashPassword("Demo@1234") })
        console.log("userObj", userObj)
        let dbResponse = await userObj.save()

        console.log("dbResponse", dbResponse)
        res.send({ message: "success" })
    } catch (err) {
        console.log(err, "error in addUser")
    }
}
const employeeAddService = async (req, res) => {
    try {
        console.log(req.body, "req.body")
        let userObj = userModel({ ...req.body, password: await hashPassword("Demo@1234") })
        console.log("userObj", userObj)
        let dbResponse = await userObj.save()

        console.log("dbResponse", dbResponse)
        res.send({ message: "success" })
    } catch (err) {
        console.log(err, "error in addUser")
    }
}

const addRoleService = async (req, res) => {
    try {
        let payload = {
            roleName: req.body.roleName,
            permissions: req.body.permissions
        }
        console.log("payload", payload)

        let roleObj = roleModel(payload)
        await roleObj.save()
        res.send({ message: "access" })
    } catch (err) {

    }
}

const userLoginService = async (req, res) => {
    try {
        console.log("req.body", req.body)
        let { mobile, password } = req.body
        let userData = await userModel.findOne({ mobile: mobile }).populate("roleId", "roleName")
        console.log("userData", userData)
        let login = await comparePassword(password, userData.password)
        console.log("login", login)
        if (login) {
            userData = JSON.parse(JSON.stringify(userData))
            let token = createToken(userData)
            res.send({ message: "success", token, userData })
        } else {
            res.status(400).send({ message: "login failed" })
        }
        // let {name,password} req.body
    } catch (err) {
        console.log("err userLoginService", err)
    }
}

const markAttendenceService = async (req, res) => {
    try {
        console.log(req.user, "req.user")
        let role = await roleModel.findById(req.user.roleId)
        console.log("role", role)
        if (!["admin", "manager"].includes(role.roleName)) {
            res.status(400).send({ message: "Operation Not Allowed" })
        }
        let { AttendanceType, shift, status, date, userId, clientId } = req.body
        let userData = await userModel.findById(userId)
        let clientData = await clientModel.findById(clientId)
        if (userData.status != "ACTIVE") {
            res.status(400).send({ message: "User Is Inactive" })
            return
        }
        if (clientData.status != "ACTIVE") {
            res.status(400).send({ message: "Client Is Inactive" })
            return
        }
        let foundAlreadyMarked = await attendenceModel.findOne({ userId, date, status })
        if (foundAlreadyMarked) {
            res.status(400).send({ message: "Already Marked For the day" })
            return
        }
        let attendenceObj = attendenceModel({
            AttendanceType, shift, status, date, userId, clientId, markedBy: req.user._id
        })
        let response = await attendenceObj.save()
        console.log("response", response)
        res.send({ message: "success" })
    } catch (err) {
        console.log(err, "error markAttendenceService")
        res.status(500).send({ message: "something went wrong" })
    }
}

const getAttendenceDataService = async (req, res) => {
    try {
        let body = {}
        // if (req.query.id) {
        //     body = { _id: req.query.id }
        // }
        let page = 1
        let pageSize = 10
        if (req.query.page) {
            page = req.query.page
        }
        if (req.query.pageSize) {
            pageSize = req.query.pageSize
        }

        if (req.body) {
            let tempArr = {}
            let keys = Object.keys(req.body)
            if (keys.includes("userId")) {
                tempArr = { ...tempArr, userId: req.body.userId }
                delete req.body.userId
            }
            if (keys.includes("clientId")) {
                tempArr = { ...tempArr, clientId: req.body.clientId }
                delete req.body.clientId
            }
            Object.keys(req.body).map((item, index) => {
                tempArr = { ...tempArr, [item]: { $regex: req.body[item], $options: "i" } }
            })
            body = { ...tempArr, ...body, }
        }
        console.log("body", body)
        let savedData = await attendenceModel.find(body).populate("userId", "name email mobile").populate("markedBy", "name email mobile").populate("clientId", "name email mobile").skip((page - 1) * pageSize).limit(pageSize)

        res.send({
            data: savedData, message: "Success", pagination: {
                totalDocuemnt: savedData.length,
                page: page,
                pageSize: pageSize
            }
        })
    } catch (err) {
        console.log(err, "erro in get attendance")
        res.status(500).send({ message: "Something went wrong" })
    }
}


const getAllRolesService = async (req, res) => {
    try {
        let roles = await roleModel.find({})

        res.send({ roles })
    } catch (err) {
        res.status(500).send({ message: "something went wrong" })
    }
}
const getAllUserService = async (req, res) => {
    try {
        let query = {}
        if (req.query.roleId) {
            query = { roleId: req.query.roleId }
        }

        let page = 1
        let pageSize = 10
        if (req.query.page) {
            page = req.query.page
        }

        if (req.query.pageSize) {
            pageSize = req.query.pageSize
        }
        let countDoc = await userModel.countDocuments(query)
        let userData = await userModel.find(query).skip((page - 1) * pageSize).limit(pageSize).populate("roleId", "roleName")

        res.send({
            userData, pagination: {
                totalDocuemnt: countDoc,
                page: page,
                pageSize: pageSize
            }
        })

    } catch (err) {
        console.log(err, "err in getAll user")
        res.status(500).send({ message: "something went wrong" })
    }
}

const addClientService = async (req, res) => {
    try {
        let payload = {
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            address: req.body.address,
            pincode: req.body.pincode,
            gst: req.body.gst
        }
        console.log("payload", payload)

        let clientObj = clientModel(payload)
        await clientObj.save()
        res.send({ message: "Success" })
    } catch (err) {
        console.log("err", err.errorResponse.code)
        if (err.errorResponse.code == 11000) {
            res.status(400).send({ message: "Already presented" })
        } else {
            res.status(500).send({ message: "Something went wrong" })
        }
    }
}
const changePasswordService = async (req, res) => {
    try {
        let { newPassword, userId, } = req.body
        if(req.user.roleName !=="admin"){
            res.status(400).send({ message: "Not Authorised For This Action" })
        }
        let userData = await userModel.findByIdAndUpdate(userId, { password: await hashPassword(newPassword) })
        res.send({ message: "Pawword is Changed" })

    } catch (err) {
        res.status(500).send({ message: "Something went wrong" })
    }
}
const updateClientStatusService = async (req, res) => {
    try {

        let id = req.params.id
        let status = req.body.status
        console.log("id", id)
        let deleteData = await clientModel.findByIdAndUpdate(id, { status: status })
        if (deleteData) {

            res.send({ message: "Success" })
        } else {
            res.status(400)({ message: "data Not Found" })

        }

    } catch (err) {

    }
}

const updateUserStatusService = async (req, res) => {
    try {

        let id = req.params.id
        let status = req.body.status
        console.log("id", id)
        let deleteData = await userModel.findByIdAndUpdate(id, { status: status })
        if (deleteData) {
            res.send({ message: "Success" })
        } else {
            res.status(400)({ message: "data Not Found" })
        }

    } catch (err) {

    }
}
const getClientService = async (req, res) => {
    try {
        let body = {}
        let page = 1
        let pageSize = 10
        if (req.query.page) {
            page = req.query.page
        }
        if (req.query.pageSize) {
            pageSize = req.query.pageSize
        }

        if (req.query.id) {
            body = { _id: req.query.id }
        }
        if (req.body) {
            let tempArr = {}
            Object.keys(req.body).map((item, index) => {
                tempArr = { ...tempArr, [item]: { $regex: req.body[item], $options: "i" } }
            })
            body = { ...tempArr, ...body, }
        }
        console.log("body", body)
        let savedData = await clientModel.find(body).skip((page - 1) * pageSize).limit(pageSize)
        // let totalDocuemnt=await clientModel.countdocuemnt().skip((page-1)*pageSize).limit(pageSize)
        res.send({
            data: savedData, message: "Success", pagination: {
                totalDocuemnt: savedData.length,
                page: page,
                pageSize: pageSize
            }
        })
    } catch (err) {
        console.log(err, "err")
        res.status(500).send({ message: "Something went wrong" })
    }
}

// userRouter.post("/addClient",addClient)
// userRouter.put("/updateClient",updateClient)
// userRouter.get("/updateClient",getClient)
// userRouter.get("/getClientById",getClient)

module.exports = {
    userLoginService,
    userAddService,
    addRoleService,
    markAttendenceService,
    getAllRolesService,
    getAllUserService,
    getClientService,
    addClientService,
    getAttendenceDataService,
    updateClientStatusService,
    updateUserStatusService,
    changePasswordService
}