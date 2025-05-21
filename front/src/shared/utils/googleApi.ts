import axios from "axios";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const googleApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
});

export async function calcularDistancia(
  origem: { lat: number; lng: number },
  destino: { lat: number; lng: number },
): Promise<number | null> {
  try {
    const url = "/distancematrix/json";
    const params = {
      origins: `${origem.lat},${origem.lng}`,
      destinations: `${destino.lat},${destino.lng}`,
      key: GOOGLE_API_KEY,
    };
    const response = await googleApi.get(url, { params });
    const distance = response.data.rows[0]?.elements[0]?.distance?.value; // metros
    return distance ? distance / 1000 : null; // retorna em km
  } catch (err) {
    console.error("❌ Erro no cálculo de distância:", err);
    return null;
  }
}

export async function geocodeTexto(endereco: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = "/geocode/json";
    const params = {
      address: endereco,
      key: GOOGLE_API_KEY,
    };
    const response = await googleApi.get(url, { params });
    const results = response.data.results;
    if (results && results.length > 0) {
      const location = results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  } catch (err) {
    console.error("❌ Erro ao geocodificar endereço:", err);
    return null;
  }
}