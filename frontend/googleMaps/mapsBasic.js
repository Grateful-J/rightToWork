import { Loader } from "@googlemaps/js-api-loader";

const gAPIKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let map;
let center;

//Loads Google Maps API
const loader = new Loader({
  apiKey: gAPIKey,
  version: "weekly",
  language: "en",
});

loader.load().then(async () => {
  const { Map } = await google.maps.importLibrary("maps");
  //const { Place } = await google.maps.importLibrary("places"); // tbd on if this will work?

  //Generates a new Map on ""./basic.html" div with id "map"
  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
});

async function findPlaces() {
  const { Place } = await google.maps.importLibrary("places");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const request = {
    textQuery: "Madison Square Garden",
    fields: ["location", "adrFormatAddress"],
    //includedType: ,
    //locationBias: "",
    //isOpenNow: ,
    language: "en-US",
    maxResultCount: 8,
    minRating: 3.2,
    region: "us",
    useStrictTypeFiltering: false,
  };
  //@ts-ignore
  const { places } = await Place.searchByText(request);

  if (places.length) {
    console.log(places[0]);
    const newMapCenter = places[0].location;
    //pass newMapCenter to map "center" property
    map.setCenter(newMapCenter);
    map.setZoom(10);

    // Chooses top search result
    let adrFormatAddress = places[0].adrFormatAddress;
    // Extract text from HTML
    let cleanAddress = adrFormatAddress.replace(/<[^>]*>/g, "");

    // Split by comma and map through each to trim whitespace
    const addressElements = cleanAddress.split(",").map((element) => element.trim());

    console.log(`Street Address: ${addressElements[0]}`);
    console.log(`Locality: ${addressElements[1]}`);

    // Extract Region and Zip Code
    let regionZip = addressElements[2].match(/([A-Z]{2})\s(\d{5})/);
    let state = regionZip[1];
    let zipCode = regionZip[2];

    console.log(`Region: ${state}`);
    console.log(`Zip Code: ${zipCode}`);
    console.log(`Country Name: ${addressElements[3]}`);
  }
}

//call findPlaces
findPlaces();
