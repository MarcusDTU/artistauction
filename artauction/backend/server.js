import {supabase} from "./dbConfig.js";
import express from "express";
import cors from "cors";
import bidRoutes from "./routes/bidRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use('/bid', bidRoutes)




app.get('/',(req, res) => {
    return res.json("Server is running");
})

app.listen(8081, () => {
    console.log("listing")
})