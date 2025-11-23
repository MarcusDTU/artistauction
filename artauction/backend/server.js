import {supabase} from "./dbConfig.js";
import express from "express";
import cors from "cors";
import bidRoutes from "./routes/bidRoutes.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import ArtworkRoutes from "./routes/ArtworkRoutes.js";
import ArtistRoutes from "./routes/ArtistRoute.js";
import AuctionRoute from "./routes/AuctionRoute.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use('/bid', bidRoutes)
app.use('/profiles', ProfileRoutes);
app.use('/artwork', ArtworkRoutes);
app.use('/artist', ArtistRoutes);
app.use('/auction', AuctionRoute);




app.get('/',(req, res) => {
    return res.json("Server is running");
})

app.listen(8081, () => {
    console.log("listing")
})