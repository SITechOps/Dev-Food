export function calcularTaxaEntrega(distancia: number): number {
  if (distancia < 2) return 0;
  if (distancia < 5) return 5;
  if (distancia < 10) return 10;
  return 15;
}
