export function getRangeByDataInput(
  ano: number,
  mes: number = 0,
  dia: number = 0
): { dataInicial: Date; dataFinal: Date } | null {
  
  if (ano <= 0 || Number.isNaN(dia)) {
    console.log("Ano não fornecido");
    return null;
  }

  if (dia > 0 && mes <= 0) {
    console.log("Não é permitido informar dia sem informar mês.");
    return null;
  }

  if (dia > 0 && !Number.isNaN(dia) && mes > 0 && !Number.isNaN(mes)) {
    const dataInicial = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0));
    const dataFinal = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59));
    return { dataInicial, dataFinal };
  }

  if (mes > 0 && !Number.isNaN(mes)) {
    const dataInicial = new Date(Date.UTC(ano, mes - 1, 1, 0, 0, 0));
    const dataFinal = new Date(Date.UTC(ano, mes, 0, 23, 59, 59));
    return { dataInicial, dataFinal };
  }

  // filtro para o ano todo
  const dataInicial = new Date(Date.UTC(ano, 0, 1, 0, 0, 0));
  const dataFinal = new Date(Date.UTC(ano, 11, 31, 23, 59, 59));
  return { dataInicial, dataFinal };
}
