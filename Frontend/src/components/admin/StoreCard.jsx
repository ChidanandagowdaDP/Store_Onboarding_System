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
    { name: "oneYearCharges", label: "1st Year Charge", type: "number" },
  ],
  payments: [
    {
      name: "systemRequired",
      label: "System Required",
      type: "select",
      options: ["yes", "no"],
      readOnly: true,
    },
    {
      name: "systemAmount",
      label: "System Amount",
      type: "text",
      readOnly: true,
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      options: ["pending", "received"],
      readOnly: true,
    },
    {
      name: "receivedAmount",
      label: "Received Amount",
      type: "text",
      readOnly: true,
    },
    {
      name: "pendingAmount",
      label: "Pending Amount",
      type: "text",
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
      options: ["yes", "no"],
    },
    { name: "lanes", label: "Number of Lanes", type: "text" },
  ],
};

// Helper: Format date YYYY-MM-DD
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

  // Local state to render immediate updates
  const [storeData, setStoreData] = useState(store);

  useEffect(() => {
    setStoreData(store);
  }, [store]);

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setFieldValue(value);
  };

  const handleFieldUpdate = async (field) => {
    const token = Cookies.get("token");
    if (!token) return alert("Unauthorized");

    const payload = {};
    payload[field] = fieldValue;

    if (field === "goLiveDate") {
      const date = new Date(fieldValue);
      date.setFullYear(date.getFullYear() + 1);
      payload.renewalDate = date.toISOString();
    }

    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/store/updatestore/${store._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) alert(res.data.message);
      setStoreData((prev) => ({ ...prev, ...payload }));
      setEditingField(""); // go back to pencil
      refreshStores?.(); // refresh full list if function provided
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const renderField = (field) => {
    const { name, type, options, readOnly } = field;
    const originalValue = storeData[name];
    const isChanged = fieldValue !== originalValue;

    // Read-only fields (payment section + renewalDate)
    if (readOnly) {
      if (type === "select")
        return (
          <div className="bg-gray-100 px-3 py-2 rounded">
            {originalValue || "-"}
          </div>
        );
      if (type === "date")
        return (
          <div className="bg-gray-100 px-3 py-2 rounded">
            {formatDate(originalValue)}
          </div>
        );
      return (
        <div className="bg-gray-100 px-3 py-2 rounded">
          {originalValue || "-"}
        </div>
      );
    }

    // Editing mode
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
      } else if (type === "date") {
        inputElement = (
          <input
            type="date"
            value={formatDate(fieldValue)}
            onChange={(e) => setFieldValue(e.target.value)}
            className="border rounded px-3 py-2"
          />
        );
      } else {
        inputElement = (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="border rounded px-3 py-2"
          />
        );
      }

      return (
        <div className="flex gap-2 items-center">
          {inputElement}
          {isChanged && (
            <button
              onClick={() => handleFieldUpdate(name)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          )}
          <button
            onClick={() => setEditingField("")}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      );
    }

    // Default display mode
    let displayValue = "";
    if (type === "date") displayValue = formatDate(originalValue);
    else displayValue = originalValue?.toString() || "";

    return (
      <div className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center">
        <span>{displayValue}</span>
        <Pencil
          size={16}
          className="text-gray-500 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(name, originalValue);
          }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Store Card Summary */}
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
                  className={`px-6 py-2 font-semibold capitalize ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-2 gap-4">
              {fieldConfig[activeTab].map((field) => {
                // Conditional: show systemAmount only if systemRequired = "yes"
                if (
                  field.name === "systemAmount" &&
                  storeData.systemRequired !== "yes"
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
