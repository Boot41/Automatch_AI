import axios from "axios";

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.address) {
      const city = response.data.address.city || response.data.address.town || response.data.address.village;
      console.log("Detected City:", city);
      return city;
    } else {
      throw new Error("Location Not Found");
    }
  } catch (err:any) {
    console.error("Reverse Geocode Error:", err.message);
    throw new Error("Failed to fetch location");
  }
};
