import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";
import RoutesLogin from "./routes/RoutesLogin";
import RoutesCliente from "./routes/RoutesCliente";
import RoutesFuncionario from "./routes/RoutesFuncionario";
import RoutesCabeleireiro from "./routes/RoutesCabeleireiro";
import RoutesAgendamento from "./routes/RoutesAgendamento";
import RoutesAtendimento from "./routes/RoutesAtendimento";
import RoutesIA from "./routes/RoutesIA";
import RoutesImagem from "./routes/RoutesImag";

const app = express();
const port = process.env.PORT;
const route = Router();
app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.send("hello world from API gateway");
});

const cors = require("cors");
app.use(cors());

app.use(route);
app.use(RoutesCabeleireiro);
app.use(RoutesAtendimento);
app.use(RoutesLogin);
app.use(RoutesCliente);
app.use(RoutesFuncionario);
app.use(RoutesAgendamento);
app.use(RoutesIA);
app.use(RoutesImagem);
app.listen(port, () => console.log(`server running on port ${port}`));
