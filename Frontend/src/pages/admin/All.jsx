import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StoreCard from "../../components/admin/StoreCard";
import DownloadExcelButton from "../../components/admin/DownloadExcel";

const All = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch All Stores
  const fetchStores = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${BACKEND_URL}/api/store/getstores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const storesData = response.data.stores || [];
      setStores(storesData);
      setFilteredStores(storesData);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [BACKEND_URL]);

  // 🔹 Search Function
  const handleSearch = (query) => {
    setSearchQuery(query);

    const filtered = stores.filter((store) =>
      store.storeName.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredStores(filtered);
  };

  // 🔹 Prepare Excel Data (All Fields)
  const excelData = stores.map((store) => ({
    ...stores,
    GoLiveDate: store.goLiveDate?.split("T")[0],
    renewalDate: store.renewalDate?.split("T")[0],
    createdAt: store.createdAt?.split("T")[0],
    updatedAt: store.updatedAt?.split("T")[0],
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Search Section */}
      <div className="sticky top-0 z-20 bg-white shadow p-3">
        <div className="flex flex-col md:flex-row justify-end items-center gap-2">
          <input
            type="text"
            placeholder="Search by Store Name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full md:w-1/3"
          />

          <DownloadExcelButton data={excelData} fileName="All_Stores" />
        </div>
      </div>

      {/* Scrollable Store List */}
      <div className="flex-1 overflow-y-auto p-1 space-y-2">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <StoreCard
              key={store._id}
              store={store}
              refreshStores={fetchStores}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No stores found</p>
        )}
      </div>
    </div>
  );
};

export default All;
