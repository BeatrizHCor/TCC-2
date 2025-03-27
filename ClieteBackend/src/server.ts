import app from "./app";
import dotenv from "dotenv";
dotenv.config();
app.listen(PORT, () =
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
