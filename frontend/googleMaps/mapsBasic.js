import { Loader } from "@googlemaps/js-api-loader";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const gAPIKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let map;
let autocomplete;

//Loads Google Maps API
const loader = new Loader({
  apiKey: gAPIKey,
  version: "weekly",
  libraries: ["places", "marker"], // Loads places library for autocomplete field
  language: "en",
});

loader.load().then(async () => {
  const mapOptions = {
    center: { lat: 36.171563, lng: -115.1391009 },
    zoom: 8,
    mapId: `r2w-Map-Tracker`,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Initialize the Autocomplete
  const input = document.getElementById("locationInput"); // Your input element for location
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map); // Bias autocomplete results towards map viewport

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // Set up event listener on autocomplete to handle place selection
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Why not zoom in a bit?
    }

    // Clear previous markers and create a new marker at selected location
    if (window.marker) window.marker.setMap(null);

    window.marker = new AdvancedMarkerElement({
      map: map,
      position: place.geometry.location,
    });

    console.log(`Selected place: ${place.formatted_address}`);
  });
});

// Event Listener for onSubmit
document.getElementById("locationForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const locationInput = document.getElementById("locationInput").value;
  findPlaces(locationInput);
});

async function findPlaces(locationQuery) {
  const { Place } = await google.maps.importLibrary("places");
  const request = {
    textQuery: locationQuery,
    fields: ["displayName", "location", "adrFormatAddress"],
    language: "en-US",
    maxResultCount: 8,
    minRating: 3.2,
    region: "us",
    useStrictTypeFiltering: false,
  };

  const { places } = await Place.searchByText(request);

  if (places.length) {
    console.log(places[0]);
    const newMapCenter = places[0].location;
    //pass newMapCenter to map "center" property
    map.setCenter(newMapCenter);
    map.setZoom(10);

    new google.maps.marker({
      map,
      anchorPoint: new google.maps.Point(location),
    });

    // Chooses top search result
    let adrFormatAddress = places[0].adrFormatAddress;
    // Extract text from HTML
    let cleanAddress = adrFormatAddress.replace(/<[^>]*>/g, "");

    // Split by comma and map through each to trim whitespace
    const addressElements = cleanAddress.split(",").map((element) => element.trim());

    console.log(displayName);

    console.log(`Street Address: ${addressElements[0]}`);
    console.log(`Locality: ${addressElements[1]}`);

    // Extract Region and Zip Code
    let regionZip = addressElements[2].match(/([A-Z]{2})\s(\d{5})/);
    let state = regionZip[1];
    let zipCode = regionZip[2];

    console.log(`Region: ${state}`);
    console.log(`Zip Code: ${zipCode}`);
    console.log(`Country Name: ${addressElements[3]}`);

    // create json object
    const newLocation = {
      fullAddress: `${addressElements[0]}, ${addressElements[1]}, ${addressElements[2]}, ${addressElements[3]}`,
      street: `${addressElements[0]}`,
      city: `${addressElements[1]}`,
      state: `${state}`,
      zip: `${zipCode}`,
      country: `${addressElements[3]}`,
    };

    // POST newLocation
    addLocation(newLocation);
    console.log(`New Location: ${newLocation}`);
  }
}

//POST new locations
async function addLocation(location) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    if (response.ok) {
      console.log("Location added");
    } else {
      console.error("Failed to add location");
    }
  } catch (error) {
    console.error("Failed to add location", error);
  }
}
