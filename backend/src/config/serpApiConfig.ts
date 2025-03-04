import axios from "axios";
import {SERP_API_KEY} from "../secrets"

export const getGoogleDealers = async (query: string, location: string) => {
  const apiKey = SERP_API_KEY;  // Replace your key
  const url = `https://serpapi.com/search?engine=google_local&q=${query}&location=${encodeURIComponent(
    location
  )}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (!response.data.local_results) {
      throw new Error("No dealers found");
    }

    return response.data.local_results.slice(0, 5);
  } catch (err: any) {
    console.error("SerpAPI Error:", err.response?.data?.error || err.message);
    throw new Error("Failed to fetch dealers");
  }
};
