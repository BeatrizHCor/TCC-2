import dotenv from "dotenv";
import express, { NextFunction, Request, Response, Router } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import ImagemRoutes from "./routes/ImagemRoutes";
import PortfolioRoutes from "./routes/PortfolioRoutes";
import HistoricoSimulacaoRoutes from "./routes/HistoricoSimulacaoRoutes"

dotenv.config();
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT;
const route = Router();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

route.get("/", (_req: Request, res: Response) => {
  res.send("hello world with Typescript");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(route);
app.use(ImagemRoutes);
app.use(PortfolioRoutes);
app.use(HistoricoSimulacaoRoutes)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada" });
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
