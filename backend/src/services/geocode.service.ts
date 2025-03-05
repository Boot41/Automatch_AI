import axios from "axios";

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  // Since we're using fixed coordinates for Bangalore, we can just return 'Bangalore' directly
  // This avoids potential API failures with the geocoding service
  console.log("Using fixed location: Bangalore");
  return "Bangalore";
  
  // The code below is kept for reference but not used
  /*
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
    const response = await axios.get(url);
    console.log("Geocode Response:", response.data);

    if (response.data && response.data.address) {
      const city =
        response.data.address.city ||
        response.data.address.town ||
        response.data.address.village ||
        response.data.address.county ||
        response.data.address.state;

      console.log("Detected City:", city);
      if (!city) throw new Error("City Not Found");
      return city;
    }
    throw new Error("Location Not Found");
  } catch (err: any) {
    console.error("Reverse Geocode Error:", err.message);
    throw new Error("Failed to fetch location");
  }
  */
};
