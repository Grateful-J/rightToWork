import { Loader } from "@googlemaps/js-api-loader";

const gAPIKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loader = new Loader({
  apiKey: gAPIKey,
  version: "weekly",
  language: "en",
});

loader.load().then(async () => {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
});
