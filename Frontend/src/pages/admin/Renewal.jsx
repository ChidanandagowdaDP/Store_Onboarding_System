import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import DownloadExcelButton from "../../components/admin/DownloadExcel";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to format date + time
const formatDateTime = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleDateString() +
      " " +
      new Date(isoString).toLocaleTimeString()
    : "N/A";

const RenewalApproval = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStoreId, setExpandedStoreId] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/store/getstores?renewal=true`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setStores(response.data.stores || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleExpand = (storeId) => {
    setExpandedStoreId(expandedStoreId === storeId ? null : storeId);
  };

  // Renew Now button handler
  const handleRenewNow = async (storeId, renewalAmount) => {
    try {
      const token = Cookies.get("token");

      // PATCH request with proper headers and body
      const res = await axios.patch(
        `${BACKEND_URL}/api/store/renewStore/${storeId}`,
        { renewalAmount }, // request body
        {
          headers: { Authorization: `Bearer ${token}` }, // config with headers
        },
      );

      if (res.status === 200) {
        alert("Store renewed successfully!");

        // Refresh the store list
        const response = await axios.get(
          `${BACKEND_URL}/api/store/getstores?renewal=true`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setStores(response.data.stores || []);
        setExpandedStoreId(null);
      }
    } catch (error) {
      console.error(error);
      alert("Renewal failed");
    }
  };

  // Prepare Excel data
  const excelData = filteredStores.map((store) => ({
    ...store,
    goLiveDate: store.goLiveDate?.split("T")[0],
    renewalDate: store.renewalDate?.split("T")[0],
    createdAt: store.createdAt?.split("T")[0],
    updatedAt: store.updatedAt?.split("T")[0],
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Sticky search + download */}
      <div className="sticky top-0 z-20 bg-white shadow p-3">
        <div className="flex flex-col md:flex-row justify-end items-center gap-2">
          <input
            type="text"
            placeholder="Search Renewal Stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full md:w-1/3"
          />
          <DownloadExcelButton data={excelData} fileName="Renewal_Stores" />
        </div>
      </div>

      {/* Store list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-100">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => {
            const isExpanded = expandedStoreId === store._id;
            return (
              <div
                key={store._id}
                className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
              >
                {/* Always visible: Store Name + Address */}
                <div onClick={() => toggleExpand(store._id)}>
                  <h2 className="text-lg font-semibold">{store.storeName}</h2>
                  <p className="text-gray-600">{store.address}</p>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t pt-2">
                    <p>
                      <span className="font-semibold">Go Live Date: </span>
                      {formatDateTime(store.goLiveDate)}
                    </p>
                    <p>
                      <span className="font-semibold">Renewal Date: </span>
                      {formatDateTime(store.renewalDate)}
                    </p>
                    <p>
                      <span className="font-semibold">Renewal Amount: </span>
                      <strong>{store.renewalAmount}</strong>
                    </p>

                    {/* Renew Now button */}
                    <div className="mt-2">
                      <button
                        onClick={() => handleRenewNow(store._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Renew Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No renewal stores found</p>
        )}
      </div>
    </div>
  );
};

export default RenewalApproval;
