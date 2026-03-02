import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StoreCard = ({ store, onDeleted }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);

  const handleCancel = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this store? This will delete it permanently.",
    );

    if (!confirmDelete) return;

    try {
      const token = Cookies.get("token");

      await axios.delete(`${BACKEND_URL}/api/store/deletestore/${store._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Store Deleted Successfully");

      if (onDeleted) onDeleted(store._id);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert("Failed to delete store");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-4"
      onClick={handleToggle}
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-bold">{store.storeName}</h2>
          <p className="text-sm text-gray-500">{store.address}</p>

          {/* 🔥 Show Store ID in header when Active */}
          {store.status === "Active" && store.storeId && (
            <p className="text-sm font-bold text-green-700 mt-1">
              Store ID: {store.storeId}
            </p>
          )}
        </div>

        <span
          className={`px-4 py-2 rounded-full font-semibold text-white text-sm ${
            store.status === "Active"
              ? "bg-green-600"
              : store.status === "pending"
                ? "bg-amber-400"
                : "bg-gray-500"
          }`}
        >
          {store.status}
        </span>
      </div>

      {/* ================= EXPANDED SECTION ================= */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm text-gray-700">
          <p>
            <strong>Group:</strong> {store.groupName}
          </p>
          <p>
            <strong>District:</strong> {store.district}
          </p>
          <p>
            <strong>Store Type:</strong> {store.storeType}
          </p>
          <p>
            <strong>KSBCL ID:</strong> {store.ksbclId}
          </p>
          <p>
            <strong>KSBCL Password:</strong> {store.ksbclPassword}
          </p>

          <p>
            <strong>Lane Available:</strong> {store.laneAvailable}
          </p>

          {store.laneAvailable === "Yes" && (
            <p>
              <strong>No. of Lanes:</strong> {store.lanes}
            </p>
          )}

          <p>
            <strong>Owner Name:</strong> {store.ownerName}
          </p>
          <p>
            <strong>Owner Mobile:</strong> {store.ownerMobile}
          </p>
          <p>
            <strong>Owner Email:</strong> {store.ownerEmail}
          </p>

          <p>
            <strong>Cashier Name:</strong> {store.cashierName}
          </p>
          <p>
            <strong>Cashier Mobile:</strong> {store.cashierMobile}
          </p>

          <p>
            <strong>Go Live Date:</strong> {formatDate(store.goLiveDate)}
          </p>

          <p>
            <strong>1 Year Charges:</strong> ₹{store.oneYearCharges}
          </p>

          <p>
            <strong>Renewal Amount:</strong> ₹{store.renewalAmount}
          </p>

          <p>
            <strong>System Required:</strong> {store.systemRequired}
          </p>

          {store.systemRequired === "Yes" && (
            <p>
              <strong>System Amount:</strong> ₹{store.systemAmount}
            </p>
          )}

          <p>
            <strong>Lead Given By:</strong> {store.leadGivenBy}
          </p>

          {/* 🔥 Big Highlighted Store ID when Active */}
          {store.status === "Active" && store.storeId && (
            <div className="col-span-1 md:col-span-2 mt-3 bg-green-100 w-fit border border-green-500 p-3 rounded-lg">
              <p className="text-lg font-bold ">Store ID: {store.storeId}</p>
            </div>
          )}

          {/* Cancel Button Only for Pending */}
          {store.status === "Pending" && (
            <div className="col-span-1 md:col-span-2 mt-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Cancel Store
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreCard;
