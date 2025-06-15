const mapApiJs = "https://maps.googleapis.com/maps/api/js";
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

let isGoogleMapsLoaded = false;

export const initMapScript = async (): Promise<void> => {
  if (isGoogleMapsLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;
    if (window.google && window.google.maps) {
      isGoogleMapsLoaded = true;
      return resolve();
    }

    const scriptExists = document.querySelector(
      `script[src^="${mapApiJs}?key=${googleApiKey}"]`,
    );
    if (!scriptExists) {
      const script = document.createElement("script");
      script.src = `${mapApiJs}?key=${googleApiKey}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isGoogleMapsLoaded = true;
        resolve();
      };
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    } else {
      scriptExists.addEventListener("load", () => {
        isGoogleMapsLoaded = true;
        resolve();
      });
    }
  });
};
