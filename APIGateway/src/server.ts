import express from "express";
import "dotenv/config";
import { Router, Request, Response } from "express";
import RoutesLogin from "./RoutesLogin";
import RoutesCustomer from "./RoutesCustomer";
import dotenv from "dotenv";
const app = express();
const port = process.env.PORT;
const frontURL = process.env.FRONT_URL || "http://localhost:5173";
const route = Router();
dotenv.config();
app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.send("hello world from API gateway");
});

const cors = require("cors");
app.use(cors());


app.use(route);
app.use(RoutesLogin);
app.use(RoutesCustomer);
app.listen(port, () => console.log(`server running on port ${port}`));
