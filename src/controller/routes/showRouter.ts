import express from "express";
import { UserController } from "../UserController";


export const showRouter = express.Router();

const showController = new UserController();