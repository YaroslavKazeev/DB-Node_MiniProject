import express from "express";
import { addUser, login } from "../controllers/usersController.js";
const userRouter = express.Router();

userRouter.post("/register", addUser);
userRouter.post("/login", login);

export default userRouter;
