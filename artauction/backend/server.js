import {supabase} from "./dbConfig.js";
import express from "express";
import cors from "cors";
import bidRoutes from "./routes/bidRoutes.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import ArtworkRoutes from "./routes/ArtworkRoutes.js";
import ArtistRoutes from "./routes/ArtistRoute.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use('/bid', bidRoutes)
app.use('/profiles', ProfileRoutes);
app.use('/artwork', ArtworkRoutes);
app.use('/artist', ArtistRoutes);



// Get all bids (most recent first)
/*app.get('/bid', async (req, res) => {
    try {
        const {data, error} = await supabase
            .from('Bid')
            .select('*');
        if (error){
            return res.status(500).json({error: error.message});
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});
*/

app.get('/',(req, res) => {
    return res.json("Server is running");
})

app.listen(8081, () => {
    console.log("listing")
})