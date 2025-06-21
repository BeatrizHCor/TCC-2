export async function handleApiResponse<T>(
    response: Response,
    operation: string,
): Promise<T | false > {
    switch (response.status) {
        case 200:
            return (await response.json()) as T;
        case 201:
            return (await response.json()) as T;
        case 204:
            console.error(`${operation} completado com sucesso (204 No Content)`);
            return false;
        case 400:
            console.error(
                `Requisição inválida ao ${operation} (400): parametros inálidos ou ausentes`,
            );
            return false;
        case 404:
            console.error(
                `Erro interno ao ${operation} (404), não localizado`,
            );
            return false;
        case 409:
            console.error(
                `Erro interno ao ${operation} (409), rigistro não pode ser duplicado`,
            );
            return false;
        case 500:
            console.error(`Erro interno ao ${operation} (500)`);
            return false;
        default:
            console.error(`Erro ao ${operation}: status ${response.status}`);
            return false;
    }
}