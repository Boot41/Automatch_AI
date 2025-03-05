import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/auth';
import { Smile, X } from 'lucide-react';

export default function DealerButton({ axiosInstance }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState('');
  const [dealers, setDealers] = useState([]);
  const { token } = useAuth();

  const fetchDealers = async () => {
    if (!token) {
      alert("You must be logged in to access this feature");
      return;
    }

    try {
      const response = await axiosInstance.post('http://localhost:3000/api/v1/dealer/find', {
        product,
        latitude: 12.9715,
        longitude: 77.5945,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.dealers)) {
        setDealers(response.data.dealers);
      } else {
        setDealers([]);
      }
    } catch (error) {
      console.error('Fetch Dealers Error:', error);
      setDealers([]);
    }
    setOpen(false);
  };

  return (
    <div>
      <button
        className="fixed bottom-18 right-5 bg-blue-600 p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition duration-300 text-white font-semibold my-4 flex items-center justify-center"
        onClick={() => setOpen(true)}
      >
        <Smile size={30} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gray-900 p-8 rounded-xl shadow-2xl w-96 relative"
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition" 
              onClick={() => setOpen(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Enter Product Name</h2>
            <input
              className="w-full p-3 border border-gray-700 rounded-lg mb-6 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product Name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <button
              className="bg-green-600 text-white p-3 rounded-lg w-full hover:bg-green-700 transition duration-300 font-semibold"
              onClick={fetchDealers}
            >
              Submit
            </button>
          </motion.div>
        </div>
      )}

      {dealers.length > 0 && (
        <div className="bg-gray-900 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 text-white mx-auto px-10">
          {dealers.map((dealer, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="">
              <div className="border border-gray-700 rounded-2xl overflow-hidden shadow-lg bg-gray-800 h-full flex flex-col">
                <img
                  src={dealer.thumbnail}
                  alt={dealer.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-2">{dealer.title}</h3>
                    <p className="text-sm mb-2">{dealer.address}</p>
                    <p className="text-sm mb-2">Rating: {dealer.rating}</p>
                    <p className="text-sm">Phone: {dealer.phone}</p>
                  </div>
                  <a
                    href={dealer.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline mt-4 text-sm cursor-pointer"
                  >
                    View on Google
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
