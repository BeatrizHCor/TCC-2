/**
 * Cria um range de datas baseado em ano, mês e dia, considerando o fuso horário local.
 * O banco salva sempre em UTC, mas a busca deve considerar o fuso local.
 * 
 * @param ano - Ano desejado (obrigatório)
 * @param mes - Mês desejado (opcional, 1-12)
 * @param dia - Dia desejado (opcional, 1-31)
 * @param fuso - Diferença para UTC (default: -3 para horário de Brasília)
 * @returns Range { dataInicial, dataFinal } ou null se parâmetros inválidos
 */
export function getRangeByDataInput(
  ano: number,
  mes: number = 0,
  dia: number = 0,
  fuso: number = -3
): { dataInicial: Date; dataFinal: Date } | null {

  if (ano <= 0 || Number.isNaN(ano)) {
    console.log("Ano não fornecido ou inválido");
    return null;
  }

  if (dia > 0 && mes <= 0) {
    console.log("Não é permitido informar dia sem informar mês.");
    return null;
  }

  if (dia > 0 && mes > 0) {
    // Filtro para um dia específico
    const dataInicial = new Date(Date.UTC(ano, mes - 1, dia, 0 - fuso, 0, 0));
    const dataFinal = new Date(Date.UTC(ano, mes - 1, dia, 23 - fuso, 59, 59));
    return { dataInicial, dataFinal };
  }

  if (mes > 0) {
    // Filtro para o mês todo
    const dataInicial = new Date(Date.UTC(ano, mes - 1, 1, 0 - fuso, 0, 0));
    const dataFinal = new Date(Date.UTC(ano, mes, 0, 23 - fuso, 59, 59));
    return { dataInicial, dataFinal };
  }

  // Filtro para o ano todo
  const dataInicial = new Date(Date.UTC(ano, 0, 1, 0 - fuso, 0, 0));
  const dataFinal = new Date(Date.UTC(ano, 11, 31, 23 - fuso, 59, 59));
  return { dataInicial, dataFinal };
}