import express from "express"
import UserController from "../controllers/user.controller.js";

const userRouter = express.Router();

// instance of an user controller.
const userController = new UserController();

userRouter.post('/upload-data', async (req, res) => {
    userController.uploadUserData(req, res);
});

export default userRouter