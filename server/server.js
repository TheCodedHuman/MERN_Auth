// Base file (app.js analogy) for backend


// imports
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


// literals
const app = express()
const port = process.env.PORT || 4000


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


// main
app.listen(port, () => console.log(`Server started on port: ${port}`))

