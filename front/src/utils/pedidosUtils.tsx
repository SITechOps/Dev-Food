export function pedidosUtils() {
  function formatarData(data: string | undefined) {
    if (!data) return "";

    const date = new Date(data);

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    }).format(date);
  }

  function acrescentarHora(data: string) {
    const date = new Date(data);
    date.setUTCHours(date.getUTCHours() + 1);
    return date;
  }

  function calcularDiferencaTempo(data: string | undefined) {
    if (!data) return "";

    data = formatarData(data);

    const [dataParte, horaParte] = data.split(", ");
    const [dia, mes, ano] = dataParte.split("/");
    const [hora, minuto] = horaParte.split(":");

    const dataPedido = new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
      Number(hora),
      Number(minuto),
      0,
      0,
    );

    const agora = new Date();

    if (isNaN(dataPedido.getTime())) {
      return "Erro na conversão da data.";
    }

    const diffMs = agora.getTime() - dataPedido.getTime();
    const diffMinutosTotal = Math.floor(diffMs / (1000 * 60));

    const dias = Math.floor(diffMinutosTotal / (60 * 24));
    const horas = Math.floor((diffMinutosTotal % (60 * 24)) / 60);
    const minutos = diffMinutosTotal % 60;

    if (dias > 0) {
      return `${dias}d${horas}h${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h${minutos}min`;
    } else {
      return `${minutos}min`;
    }
  }

  return {
    calcularDiferencaTempo,
    formatarData,
    acrescentarHora,
  };
}
