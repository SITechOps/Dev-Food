export function calcularTaxaEntrega(distancia: number): number {
  if (distancia < 2) return 0;
  if (distancia < 5) return 5;
  if (distancia < 10) return 10;
  //pra cada 5km acima de 10km, adiciona 1 real a taxa de entrega
  if (distancia > 20) return 20 + (distancia / 5) * 1;
  return 15;
}