// src/utils/useDistanceMatrix.ts
import { LatLngLiteral } from "leaflet";

interface DistanceResult {
  distance: number | null; // Distância em quilômetros
  duration: number | null; // Duração em segundos
}

export function calcularDistancia(
  origem: LatLngLiteral,
  destino: LatLngLiteral,
): Promise<DistanceResult> {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error("Google Maps API não carregada"));
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();

    const request = {
      origins: [new window.google.maps.LatLng(origem.lat, origem.lng)],
      destinations: [new window.google.maps.LatLng(destino.lat, destino.lng)],
      travelMode: window.google.maps.TravelMode.DRIVING, // Pode ser DRIVING, WALKING, BICYCLING, TRANSIT
      unitSystem: window.google.maps.UnitSystem.METRIC, // METRIC ou IMPERIAL
    };

    console.log("🔍 Request:", request);

    service.getDistanceMatrix(request, (response, status) => {
      console.log("🔍 Response:", response);
      console.log("🔍 Status:", status);

      if (status !== window.google.maps.DistanceMatrixStatus.OK) {
        reject(new Error(`Erro no Distance Matrix Service: ${status}`));
        return;
      }

      const result = response.rows[0].elements[0];
      const distance = result.distance ? result.distance.value / 1000 : null; // metros para quilômetros
      const duration = result.duration ? result.duration.value : null; // segundos

      resolve({ distance, duration });
    });
  });
}