import express from "express";
import { ShowController } from "../ShowController";

export const showRouter = express.Router();

const showController = new ShowController();

showRouter.post("/register", showController.register);
showRouter.get("/details/:week_day", showController.getDetailsByDay);