import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDB.js"
import cookieParser from "cookie-parser"
import authRouter from "./route/authRoute.js"
import cors from "cors"
import userRouter from "./route/userRoute.js"
import courseRouter from "./route/courseRoute.js"

dotenv.config()

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

// axios 


/// routes 

app.use("/api/auth" ,authRouter)
app.use("/api/auth" ,userRouter)
app.use("/api/course",courseRouter)


app.get("/api/me", (req, res) => {
  res.json({ id: "123", name: "Mahi" })
})
 connectDb()
app.listen(PORT ,()=>{
  console.log(`Server running on address http://localhost:${PORT}`)
}) 