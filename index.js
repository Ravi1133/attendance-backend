const express = require("express")
const connection = require("./db/connection")
const dotenv = require("dotenv")
const cors =require("cors")
const userRouter = require("./router/userRoutes")
const { hashPassword, comparePassword } = require("./util")
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
let port = process.env.PORT
console.log("urlDb", process.env.DB_URL)
app.get("/healthCheck", (req, res) => {
    res.json({ message: "working" })
})
app.use("/user", userRouter)
app.listen(port, () => {
    setTimeout(() => {
        connection()
    }, 1000);
    console.log(`Server is listen ${port}`)
})

const check = async() => {
    let haspassword =await hashPassword("ravikant")
    console.log("haspassword", haspassword)
    comparePassword("ravikant", haspassword)
}


