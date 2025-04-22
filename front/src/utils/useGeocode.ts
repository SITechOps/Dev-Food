import axios from "axios";

export const geocodeTexto = async (
  endereco: string,
): Promise<{ lat: number; lng: number } | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK" && data.results.length > 0) {
      const coordenadas = data.results[0].geometry.location;
      return {
        lat: coordenadas.lat,
        lng: coordenadas.lng,
      };
    } else {
      console.error("❌ Erro ao geocodificar endereço:", data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error("❌ Erro ao geocodificar o endereço:", error);
    return null;
  }
};