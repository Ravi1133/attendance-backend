const express = require("express")
const connection = require("./db/connection")
const dotenv = require("dotenv")
const cors =require("cors")
const userRouter = require("./router/userRoutes")
const { hashPassword, comparePassword } = require("./util")
const client = require("prom-client");
const register = new client.Registry()
const {createLogger,transports} =require("winston")
const  LokiTransport=require("winston-loki")

const option={
    transports:[
        new LokiTransport({
            // labels:"appName",
            host:"http://localhost:3100"
        })
    ]
}
const logger =createLogger(option)
client.collectDefaultMetrics({register})
dotenv.config()
const app = express()
app.use(express.json())

app.use(cors({
  origin: '*', // For testing, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

let port = process.env.PORT
console.log("urlDb", process.env.DB_URL)

const httpRequestsTotal=new client.Counter({
    name:"http_request_total",
    help:"Total number of http request",
    labelNames:["method","route","status"]
})

register.registerMetric(httpRequestsTotal)
app.use((req,res,next)=>{
    console.log(req.headers,"req.headers")
    res.on("finish",()=>{
        httpRequestsTotal.inc({method:req.method,route:req.path,status:res.statusCode})
    })
    next()
})

app.get("/healthCheck", (req, res) => {
    let rendomNumber=Math.random().toFixed(6)*1000000
    if(rendomNumber<500000){
        console.log("err come")
        logger.error(`hii error ${rendomNumber}`)
    }else{
        console.log("simple")
        logger.info(`hii random number ${rendomNumber}`)
    }
    console.log("rendomNumber",rendomNumber)
    res.json({ message: "working" })
})
app.use("/user", userRouter)
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, "0.0.0.0",() => {
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


