import { Address } from "../interface/IAddress";
import { extractAddress } from "./extractAddress";

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";

export const reverseGeoCode = async (
  lat: number,
  lng: number
): Promise<Address> => {
  const url = `${geocodeJson}?key=${googleApiKey}&latlng=${lat},${lng}`;
  const response = await fetch(url);
  const data = await response.json();
  return extractAddress(data.results[0]);
};
