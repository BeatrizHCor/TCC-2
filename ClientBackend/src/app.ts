import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import clienteRoutes from './routes/clienteRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/clientes', clienteRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API do Salão - Bem-vindo!' });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});


app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

export default app;