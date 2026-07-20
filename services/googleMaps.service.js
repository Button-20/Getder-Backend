// Google Maps Web Service calls — the ONLY place the server-side Maps key is
// used. Controllers call these; the frontend never hits Google directly.
//
// Requires GOOGLE_MAPS_API_KEY in the environment. Uses Node's global fetch
// (Node 18+).

const BASE = "https://maps.googleapis.com/maps/api";

async function callGoogle(path, params) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  const qs = new URLSearchParams({ ...params, key }).toString();
  const res = await fetch(`${BASE}/${path}?${qs}`);
  return res.json();
}

// Coordinates → formatted address
async function reverseGeocode(lat, lng) {
  const json = await callGoogle("geocode/json", { latlng: `${lat},${lng}` });
  if (json.status === "OK" && json.results?.[0]) {
    return json.results[0].formatted_address;
  }
  throw new Error(json.error_message || json.status || "No results found");
}

// Places Autocomplete — restricted to Ghana (matches the original app)
async function autocomplete(input) {
  const json = await callGoogle("place/autocomplete/json", {
    input,
    components: "country:gh",
  });
  if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
    throw new Error(json.error_message || json.status);
  }
  return json.predictions || [];
}

// Driving route between two points (each an address or "lat,lng").
// Returns decoded polyline coordinates plus total distance/duration so the
// app can render the line and the backend can price the trip.
async function directions(origin, destination) {
  const json = await callGoogle("directions/json", {
    origin,
    destination,
    mode: "driving",
  });
  if (json.status !== "OK" || !json.routes?.[0]) {
    throw new Error(json.error_message || json.status);
  }
  const route = json.routes[0];
  const legs = route.legs || [];
  return {
    coordinates: decodePolyline(route.overview_polyline.points),
    distanceMeters: legs.reduce((s, l) => s + (l.distance?.value || 0), 0),
    durationSeconds: legs.reduce((s, l) => s + (l.duration?.value || 0), 0),
  };
}

// Distance Matrix — driving distance/duration for one origin→destination pair.
// Used for point-to-point ETA (e.g. driver → pickup) without a full route.
async function distanceMatrix(origin, destination) {
  const json = await callGoogle("distancematrix/json", {
    origins: origin,
    destinations: destination,
    mode: "driving",
  });
  const el = json.rows?.[0]?.elements?.[0];
  if (json.status !== "OK" || !el || el.status !== "OK") {
    throw new Error(json.error_message || el?.status || json.status);
  }
  return {
    distanceMeters: el.distance.value,
    durationSeconds: el.duration.value,
  };
}

// Fare rate card by ride type. ponytail: flat linear model — tune base (pickup
// fee), perKm and perMin per market; the mechanism is distance + duration.
const FARES = {
  Pickup: { base: 15, perKm: 4, perMin: 0.5 },
  Comfort: { base: 25, perKm: 7, perMin: 0.8 },
  "4x4": { base: 40, perKm: 12, perMin: 1.2 },
};

// Estimate a fare per ride type from the pickup→dropoff route.
async function estimateFare(pickup, dropoff) {
  const { distanceMeters, durationSeconds } = await directions(pickup, dropoff);
  const km = distanceMeters / 1000;
  const min = durationSeconds / 60;
  const fares = {};
  for (const [type, r] of Object.entries(FARES)) {
    fares[type] = Math.round(r.base + r.perKm * km + r.perMin * min);
  }
  return { distanceMeters, durationSeconds, fares };
}

// Standard Google encoded-polyline decoder → [{ latitude, longitude }]
function decodePolyline(encoded) {
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let result = 1;
    let shift = 0;
    let b;
    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 1;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push({ latitude: lat * 1e-5, longitude: lng * 1e-5 });
  }
  return points;
}

module.exports = {
  reverseGeocode,
  autocomplete,
  directions,
  distanceMatrix,
  estimateFare,
};
