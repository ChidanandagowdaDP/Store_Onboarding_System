import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Pencil } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Field configuration
const fieldConfig = {
  details: [
    { name: "groupName", label: "Group Name", type: "text" },
    { name: "storeName", label: "Store Name", type: "text" },
    { name: "address", label: "Address", type: "text" },
    { name: "geoAddress", label: "Geo Address", type: "text" },
    { name: "pincode", label: "Pincode", type: "text" },
    { name: "district", label: "District", type: "text" },
    {
      name: "storeType",
      label: "Store Type",
      type: "select",
      options: ["CL2", "CL7", "CL9"],
    },
    { name: "ownerName", label: "Owner Name", type: "text" },
    { name: "ownerMobile", label: "Owner Mobile", type: "text" },
    { name: "goLiveDate", label: "Go Live Date", type: "date" },
    {
      name: "renewalDate",
      label: "Renewal Date",
      type: "date",
      readOnly: true,
    },
  ],
  payments: [
    {
      name: "oneYearCharges",
      label: "1st Year Charge",
      type: "number",
      readOnly: true,
    },
    {
      name: "renewalAmount",
      label: "Renewal Amount",
      type: "number",
      readOnly: true,
    },
    {
      name: "systemRequired",
      label: "System Required",
      type: "select",
      options: ["Yes", "No"],
      readOnly: true,
    },
    {
      name: "systemAmount",
      label: "System Amount",
      type: "number",
      readOnly: true,
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      options: ["Pending", "Received"],
      readOnly: true,
    },
    { name: "receivedAmount", label: "Last Received Amount", type: "number" },
    {
      name: "pendingAmount",
      label: "Pending Amount",
      type: "number",
      readOnly: true,
    },
  ],
  other: [
    { name: "ksbclId", label: "KSBCL ID", type: "text" },
    { name: "ksbclPassword", label: "KSBCL Password", type: "text" },
    {
      name: "laneAvailable",
      label: "Lane Available",
      type: "select",
      options: ["Yes", "No"],
    },
    { name: "lanes", label: "Number of Lanes", type: "text" },
  ],
};

// Helper: format date YYYY-MM-DD
const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const StoreCard = ({ store, refreshStores }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [editingField, setEditingField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [storeData, setStoreData] = useState(store);

  useEffect(() => {
    setStoreData(store);
  }, [store]);

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setFieldValue(value || "");
  };

  // Updated function to call correct endpoint
  const handleFieldUpdate = async (field) => {
    const token = Cookies.get("token");
    if (!token) return alert("Unauthorized");

    const payload = { [field]: fieldValue };

    try {
      let res;

      // Use updatePayment API for receivedAmount
      if (field === "receivedAmount") {
        const payAmount = Number(fieldValue);
        if (!payAmount || payAmount <= 0) {
          return alert("Enter a valid amount");
        }
        if (payAmount > storeData.pendingAmount) {
          return alert(
            `Payment cannot be greater than pending amount (₹${storeData.pendingAmount})`,
          );
        }

        res = await axios.patch(
          `${BACKEND_URL}/api/store/updatepayment/${storeData._id}`,
          { receivedAmount: payAmount },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        // General update endpoint
        res = await axios.patch(
          `${BACKEND_URL}/api/store/updatestore/${storeData._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      if (res.status === 200) {
        alert(res.data.message);
        // Update local state with returned store data
        setStoreData(res.data.store || { ...storeData, ...payload });
      }

      setEditingField("");
      refreshStores?.();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const renderField = (field) => {
    const { name, type, options, readOnly } = field;
    const value = storeData[name];

    if (readOnly) {
      return (
        <div className="bg-gray-100 px-3 py-2 rounded">
          {type === "date" ? formatDate(value) : (value ?? "-")}
        </div>
      );
    }

    if (editingField === name) {
      let inputElement;

      if (type === "select") {
        inputElement = (
          <select
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      } else {
        inputElement = (
          <input
            type={type}
            value={type === "date" ? formatDate(fieldValue) : fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="border rounded px-3 py-2"
          />
        );
      }

      return (
        <div className="flex gap-2 items-center">
          {inputElement}
          <button
            onClick={() => handleFieldUpdate(name)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setEditingField("")}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center">
        <span>{type === "date" ? formatDate(value) : (value ?? "-")}</span>
        <Pencil
          size={16}
          className="text-gray-500 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(name, value);
          }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Summary Card */}
      <div
        onClick={() => setShowDetails(true)}
        className="bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition"
      >
        <div className="flex-1 ml-4">
          <h2 className="text-lg font-semibold">{storeData.storeName}</h2>
          <p className="text-gray-600 text-sm">{storeData.address}</p>
        </div>
        <div
          className={`text-white text-xs px-4 py-2 rounded-md ${
            storeData.status === "Active" ? "bg-green-600" : "bg-yellow-500"
          }`}
        >
          {storeData.status}
        </div>
      </div>

      {/* Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[900px] max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {storeData.storeName} Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6">
              {["details", "payments", "other"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 font-semibold capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-2 gap-4">
              {fieldConfig[activeTab].map((field) => {
                // Only show systemAmount if systemRequired = "Yes"
                if (
                  field.name === "systemAmount" &&
                  String(storeData.systemRequired).toLowerCase() !== "yes"
                )
                  return null;

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold mb-1">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoreCard;
