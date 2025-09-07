import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";


dotenv.config();
// console.log(process.env.GOOGLE_CLIENT_ID);
connectDB();
const app  = express();

app.use(express.json());

// app.use(express.json());
app.use(cors());



app.use("/auth" , authRoutes);
app.use("/posts", postRoutes);
app.get("/" , (req,res)=>{
    res.send("backend is running ");
});

const PORT = process.env.PORT|| 4000;

app.listen(PORT , () => {
    console.log(`server is runnig on ${PORT}`);

});
