import { reverseGeocode } from "../services/geocode.service";
import { getGoogleDealers } from "../config/serpApiConfig";

export const getNearbyDealers = async (product: string, location: any) => {
  const city = await reverseGeocode(location.latitude, location.longitude);
  const query = `${product} dealers`;

  const results = await getGoogleDealers(query, city);

  const dealers = results.map((dealer: any) => ({
    name: dealer.title,
    phone: dealer.phone,
    rating: dealer.rating,
    address: dealer.address,
    thumbnail: dealer.thumbnail,
    location: dealer.gps_coordinates,
  }));

  return dealers.slice(0, 3); // Only top 3 dealers
};
