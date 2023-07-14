import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser";
import contactRoute from "./routes/contact.js"
import confirmbRoute from "./routes/confirmb.js"
import cors from "cors"
import path from "path"

const app = express()
dotenv.config()
app.use(cors({ origin: "*" }))

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongodb")
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongodb disconnected")
})

mongoose.connection.on("connected", () => {
    console.log("mongodb connected")
})

app.get('/', (req, res) => {
    res.send("Hello")
})

//middlewares
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/contact", contactRoute)
app.use("/api/confirmb", confirmbRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

// static files
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const port = process.env.PORT || 8800;
const host = '0.0.0.0'

app.listen(port, host, () => {
    connect()
    console.log("connected to backend")
})