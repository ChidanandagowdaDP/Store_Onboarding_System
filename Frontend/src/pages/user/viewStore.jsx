import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StoreCard from "../../components/user/StoreCard";
import StoreSearch from "../../components/SearchBar";

export default function ViewStores() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/api/store/my-stores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(response.data.stores);
        setFilteredStores(response.data.stores);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // 🔍 Search Function
  const handleSearch = (term) => {
    const filtered = stores.filter((store) =>
      store.storeName?.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredStores(filtered);
  };

  // 🔴 Remove store from UI after deletion
  const handleDeleted = (deletedId) => {
    setStores((prev) => prev.filter((store) => store._id !== deletedId));
    setFilteredStores((prev) =>
      prev.filter((store) => store._id !== deletedId),
    );
  };

  if (loading) {
    return <div className="p-6">Loading stores...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header + Search (below navbar) */}
      <div className="sticky top-[78px] z-10 bg-white flex items-center justify-between p-4 shadow-md ">
        <h2 className="text-2xl font-bold">Your Created Stores</h2>
        <div className="w-1/3">
          <StoreSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Stores List */}
      <div className="p-1  ">
        {filteredStores.length === 0 ? (
          <p className="text-gray-500 flex justify-center">
            No matching stores found.
          </p>
        ) : (
          filteredStores.map((store) => (
            <StoreCard
              key={store._id}
              store={store}
              onDeleted={handleDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}
