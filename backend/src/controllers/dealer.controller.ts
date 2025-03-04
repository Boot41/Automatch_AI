import { getGoogleDealers } from "../config/serpApiConfig";
import { reverseGeocode } from "../services/geocode.service";

export const getNearbyDealers = async (req:any, res:any) => {
  const { product, latitude, longitude } = req.body;

  if (!product || !latitude || !longitude) {
    return res.status(400).json({ message: "Product, Latitude & Longitude are required" });
  }

  try {
    const city = await reverseGeocode(latitude, longitude); // Get City from Lat & Lon
    const dealers = await getGoogleDealers(product, city);

    return res.json({ dealers });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: err.message });
  }
};
