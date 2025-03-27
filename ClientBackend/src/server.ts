import express from 'express';
import clientRoutes from './routes/clienteRoutes';

const app = express();
app.use(express.json());

// Usar as rotas de clientes
app.use('/clients', clientRoutes);

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
