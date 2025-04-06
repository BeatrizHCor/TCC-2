import express from "express";
import "dotenv/config";
import { Router, Request, Response } from "express";
const app = express();
const port = process.env.PORT;
const route = Router();

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.send("hello world from API gateway");
});

app.use(route);

app.listen(port, () => console.log(`server running on port ${port}`));
