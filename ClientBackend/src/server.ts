import app from './app';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});