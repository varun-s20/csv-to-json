import express from "express";
import userRouter from "./src/routers/user.router.js";

const router = express.Router();

// middleware for the root of the project.
router.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to Csv file to Json format converter',
        status: 200,
        success: true
    });
});

// middleware for csvToJsonRouter.
router.use('/user',userRouter)

// middleware to handle not found routes
router.use((req, res) => {
    res.status(404).json({
        message: "API's not found",
        status: 404,
        success: false
    });
});


export default router