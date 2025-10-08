import "./env.js";
import express from "express";
import router from "./routes.js";
import connectToDB from "./src/config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router)

// checking db connection before starting the server.
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});