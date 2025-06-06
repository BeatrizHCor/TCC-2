import { toZonedTime } from "date-fns-tz";

export function getRangeByDataInputWithTimezone(
  ano: number,
  mes: number = 0,
  dia: number = 0,
  timezone: string = 'America/Sao_Paulo'
): { dataInicial: Date; dataFinal: Date } | null {

  if (ano <= 0 || Number.isNaN(ano)) {
    console.log("Ano não fornecido ou inválido");
    return null;
  }
  if (dia > 0 && mes <= 0) {
    console.log("Não é permitido informar dia sem informar mês.");
    return null;
  }
  if (mes < 0 || mes > 12) {
    console.log("Mês inválido. Deve estar entre 1 e 12");
    return null;
  }

  if (dia > 0 && mes > 0) {
    const inicio = new Date(ano, mes - 1, dia, 0, 0, 0);
    const fim = new Date(ano, mes - 1, dia, 23, 59, 59);

    return {
      dataInicial: toZonedTime(inicio, timezone),
      dataFinal: toZonedTime(fim, timezone),
    };
  }

  if (mes > 0) {
    const inicio = new Date(ano, mes - 1, 1, 0, 0, 0);

    const ultimoDia = new Date(ano, mes, 0).getDate();
    const fim = new Date(ano, mes - 1, ultimoDia, 23, 59, 59);

    return {
      dataInicial: toZonedTime(inicio, timezone),
      dataFinal: toZonedTime(fim, timezone),
    };
  }
  const inicio = new Date(ano, 0, 1, 0, 0, 0);
  const fim = new Date(ano, 11, 31, 23, 59, 59);

  return {
    dataInicial: toZonedTime(inicio, timezone),
    dataFinal: toZonedTime(fim, timezone),
  };
}

export function getRangeByStringInputWithTimezone(
  dataStr: string | null,
  timezone: string = 'America/Sao_Paulo'
): { dataInicial: Date; dataFinal: Date } | null {
  if (!dataStr) {
    console.log("Data não fornecida");
    return null;
  }

 if (!dataStr.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
   console.log("Formato de data inválido. Use YYYY-MM-DD");
   return null;
 }
  const partes = dataStr.split('-').map(Number);

  const ano = partes[0];
  const mes = partes[1] || 0; 
  const dia = partes[2] || 0; 
  if (ano <= 0 || Number.isNaN(ano)) {
    console.log("Ano não fornecido ou inválido");
    return null;
  }
  if (dia > 0 && mes <= 0) {
    console.log("Não é permitido informar dia sem informar mês.");
    return null;
  }
  if (mes < 0 || mes > 12) {
    console.log("Mês inválido. Deve estar entre 1 e 12");
    return null;
  }

  if (dia > 0 && mes > 0) {
    const inicio = new Date(ano, mes - 1, dia, 0, 0, 0);
    const fim = new Date(ano, mes - 1, dia, 23, 59, 59);

    return {
      dataInicial: toZonedTime(inicio, timezone),
      dataFinal: toZonedTime(fim, timezone),
    };
  }

  if (mes > 0) {
    const inicio = new Date(ano, mes - 1, 1, 0, 0, 0);

    const ultimoDia = new Date(ano, mes, 0).getDate();
    const fim = new Date(ano, mes - 1, ultimoDia, 23, 59, 59);

    return {
      dataInicial: toZonedTime(inicio, timezone),
      dataFinal: toZonedTime(fim, timezone),
    };
  }
  const inicio = new Date(ano, 0, 1, 0, 0, 0);
  const fim = new Date(ano, 11, 31, 23, 59, 59);

  return {
    dataInicial: toZonedTime(inicio, timezone),
    dataFinal: toZonedTime(fim, timezone),
  };
}