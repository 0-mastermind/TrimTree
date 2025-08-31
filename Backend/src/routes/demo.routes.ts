import { Router } from "express";
import { getDemo, createDemo } from "../controllers/demo.controller.js";

const demoRouter = Router();

demoRouter.get("/", getDemo);       
demoRouter.post("/", createDemo);   

export default demoRouter;
