// Base file (app.js analogy) for backend


// imports
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './db/mongodb.js'
import userRouter from "./routes/user.routes.js"


// literals
const app = express()
const port = process.env.PORT || 4000;
connectDB()                                     // can be used as a Promise with .then().catch()


// defined
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || '*'
}))
app.use(cookieParser())

app.get("/", (req, res) => res.send("API is working !!!"))


// error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.stack)
    res
        .status(500)
        .json({ message: "Internal Server Error" })
})


// routes decleraton
app.use("/api/v1/users", userRouter)


// main
app.listen(port, () => console.log(`Server started on port: ${port}`))

