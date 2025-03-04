import { getGoogleDealers } from "../config/serpApiConfig";

export const getNearbyDealers = async (product: string, location: string) => {
  const query = `${product} dealers`;
  const results = await getGoogleDealers(query, location);

  return results.map((dealer: any) => ({
    name: dealer.title,
    phone: dealer.phone,
    rating: dealer.rating,
    link: dealer.link,
    address: dealer.address,
  }));
};
