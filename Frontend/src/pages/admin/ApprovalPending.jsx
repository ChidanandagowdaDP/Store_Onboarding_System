import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ApprovalPending = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeIdInput, setStoreIdInput] = useState("");

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/store/getstores?status=pending`,
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

  const handleStoreIdUpdate = async () => {
    if (!storeIdInput) {
      alert("Please enter Store ID");
      return;
    }

    const updatedFields = {};
    if (storeIdInput !== selectedStore.storeId) {
      updatedFields.storeId = storeIdInput;
      updatedFields.status = "active";
    }

    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${BACKEND_URL}/api/store/updatestore/${selectedStore._id}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Store Updated & Activated!");

      setSelectedStore(null);
      setStoreIdInput("");
      const response = await axios.get(
        `${BACKEND_URL}/api/store/getstores?status=pending`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStores(response.data.stores || []);
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  // Helper to format Date + Time
  const formatDateTime = (isoString) =>
    isoString
      ? new Date(isoString).toLocaleDateString() +
        " " +
        new Date(isoString).toLocaleTimeString()
      : "N/A";
  const formatLabel = (field) => {
    if (!field) return "";
    return (
      field
        // Insert space before capital letters
        .replace(/([A-Z])/g, " $1")
        // Capitalize first letter of each word
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .trim()
    );
  };
  return (
    <div className="flex flex-col h-full">
      {/* Sticky Search + Download */}
      <div className="sticky top-0 z-20 bg-white shadow p-3">
        <div className="flex flex-col md:flex-row justify-end items-center gap-2">
          <input
            type="text"
            placeholder="Search Pending Stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full md:w-1/3"
          />
        </div>
      </div>

      {/* Scrollable Store List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-100">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-lg"
              onClick={() => setSelectedStore(store)}
            >
              <div>
                <h2 className="font-semibold text-lg">{store.storeName}</h2>
                <p className="text-gray-600">{store.address}</p>
              </div>
              <div className="text-white px-3 py-1 rounded bg-yellow-500">
                {store.status.toUpperCase()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No pending stores found</p>
        )}
      </div>

      {/* Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-4xl p-6 shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedStore.storeName}</h2>
              <button
                onClick={() => setSelectedStore(null)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>

            <form className="space-y-6">
              {/* Basic Information */}
              <FormSection title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "groupName",
                    "storeName",
                    "address",
                    "geoAddress",
                    "pincode",
                    "district",
                    "ksbclId",
                    "ksbclPassword",
                    "storeType",
                    "ownerName",
                    "ownerMobile",
                    "cashierName",
                    "cashierMobile",
                  ].map((field) => (
                    <InputField
                      key={field}
                      label={formatLabel(field)}
                      value={selectedStore[field] || ""}
                      readOnly
                    />
                  ))}

                  {/* Go Live Date + Time */}
                  <InputField
                    label="Go Live Date & Time"
                    value={formatDateTime(selectedStore.goLiveDate)}
                    readOnly
                  />

                  {/* Renewal Date + Time */}
                  <InputField
                    label="Renewal Date & Time"
                    value={formatDateTime(selectedStore.renewalDate)}
                    readOnly
                  />
                </div>
              </FormSection>

              {/* Store ID Input */}
              <FormSection title="Assign Store ID">
                <InputField
                  label="Store ID"
                  value={storeIdInput}
                  onChange={(e) => setStoreIdInput(e.target.value)}
                  placeholder="Enter Store ID"
                />
              </FormSection>

              {/* Update Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleStoreIdUpdate}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Update Store ID & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPending;
