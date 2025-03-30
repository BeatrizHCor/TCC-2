const API_URL = "https://api.example.com/clientes";

export const cadastrarCliente = async (cliente: { nome: string; email: string }) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar cliente");
  }

  return response.json();
};
