import { api } from "../connection/axios";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export async function calcularDistancia(
  origem: { lat: number; lng: number },
  destino: { lat: number; lng: number },
): Promise<number | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origem.lat},${origem.lng}&destinations=${destino.lat},${destino.lng}&key=${GOOGLE_API_KEY}`;
    const response = await api.get(url);
    const distance = response.data.rows[0]?.elements[0]?.distance?.value; // metros
    return distance ? distance / 1000 : null; // retorna em km
  } catch (err) {
    console.error("❌ Erro no cálculo de distância:", err);
    return null;
  }
}