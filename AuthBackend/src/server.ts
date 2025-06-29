import express, { Request, Response } from "express";
import "dotenv/config";
import RoutesLogin from "./RoutesLogin";

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world with Typescript");
});

app.use("/", RoutesLogin);

app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
});
