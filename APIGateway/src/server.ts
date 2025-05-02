import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";
import RoutesLogin from "./routes/RoutesLogin";
import RoutesCustomer from "./routes/RoutesCustomer";
import RoutesFuncionario from "./routes/RoutesFuncionario";
import RoutesCabeleireiro from "./routes/RoutesCabeleireiro";

const app = express();
const port = process.env.PORT;
const frontURL = process.env.FRONTEND_URL || "http://localhost:5173";
const route = Router();
app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.send("hello world from API gateway");
});

const cors = require("cors");
app.use(cors());


app.use(route);
app.use(RoutesCabeleireiro);
app.use(RoutesLogin);
app.use(RoutesCustomer);
app.use(RoutesFuncionario);
app.listen(port, () => console.log(`server running on port ${port}`));
