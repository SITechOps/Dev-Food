import axios from "axios";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export async function geocodeTexto(endereco: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = "https://maps.googleapis.com/maps/api/geocode/json";
    const params = {
      address: endereco,
      key: GOOGLE_API_KEY,
    };

    const response = await axios.get(url, { params });
    const results = response.data.results;

    if (results && results.length > 0) {
      const location = results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }

    return null;
  } catch (err) {
    console.error("Erro ao geocodificar endereço:", err);
    return null;
  }
}