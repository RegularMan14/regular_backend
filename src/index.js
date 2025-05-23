import connectDB from "./db/db_connect.js"
import dotenv from "dotenv"
import { app } from "./app.js"
dotenv.config({
    path: '../.env'
})

connectDB()
.then(() => {
    app.on("error", (e) => {
        console.error("ERROR: ", e)
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((e) => {
    console.log("MONGO DB COONECTION FAILED!", e)
})