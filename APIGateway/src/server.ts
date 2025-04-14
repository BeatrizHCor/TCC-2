import express from "express";
import "dotenv/config";
import { Router, Request, Response } from "express";
import RoutesLogin from "./RoutesLogin";
import RoutesCustomer from "./RoutesCustomer";
import dotenv from "dotenv";
import RoutesCabeleireiro from "./RoutesCabeleireiro";
const app = express();
const port = process.env.PORT;
const frontURL = process.env.FRONT_URL // || "http://localhost:4200";
const route = Router();
dotenv.config();
app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.send("hello world from API gateway");
});

const cors = require("cors");

app.use(cors({
  origin: frontURL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: ['Content-Type'],

}));
app.use(route);
app.use(RoutesCabeleireiro);
app.use(RoutesLogin);
app.use(RoutesCustomer);
app.listen(port, () => console.log(`server running on port ${port}`));
