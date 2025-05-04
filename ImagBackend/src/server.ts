import dotenv from 'dotenv';
import  express, { NextFunction, Request, Response, Router }  from 'express';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;
const route = Router();
const app = express();

app.use(express.json());
app.use(cors());

route.get("/", (_req: Request, res: Response) => {
  res.send("hello world with Typescript");
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
  
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  });
    
app.use(route);
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});