import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";
import DownloadExcelButton from "../../components/admin/DownloadExcel";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AmountPending = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  // Fetch Pending Payment Stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/store/getstores?paymentStatus=Pending`,
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

  // Update Payment
  const handlePaymentUpdate = async () => {
    if (!payAmount || payAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      const token = Cookies.get("token");

      await axios.patch(
        `${BACKEND_URL}/api/store/updatepayment/${selectedStore._id}`,
        { receivedAmount: Number(payAmount) },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Payment Updated Successfully");

      setSelectedStore(null);
      setPayAmount("");
      const response = await axios.get(
        `${BACKEND_URL}/api/store/getstores?paymentStatus=Pending`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStores(response.data.stores || []);
    } catch (error) {
      console.error(error);
      alert("Payment Update Failed");
    }
  };
  // 🔹 Excel Data
  const excelData = filteredStores.map((store) => ({
    Store_Name: store.storeName,
    One_Year_Charge: store.oneYearCharges,
    Renewal_Amount: store.renewalAmount,
    Received_Amount: store.receivedAmount,
    Pending_Amount: store.pendingAmount,
    Store_Status: store.status,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* 🔹 Sticky Search */}
      {/* 🔹 Sticky Search + Download */}
      <div className="sticky top-0 z-20 bg-white shadow p-3">
        <div className="flex flex-col md:flex-row justify-end items-center gap-2">
          <input
            type="text"
            placeholder="Search Payment Pending..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full md:w-1/3"
          />

          <DownloadExcelButton
            data={excelData}
            fileName="Payment_Pending_Stores"
          />
        </div>
      </div>

      {/* 🔹 Store Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-100">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store._id}
              onClick={() => setSelectedStore(store)}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-lg"
            >
              <div>
                <h2 className="font-semibold text-lg">{store.storeName}</h2>
                <p className="text-gray-600">
                  Pending: ₹ {store.pendingAmount}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-red-500 text-white px-3 py-1 rounded">
                  Pending
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded">
                  {store.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No payment pending stores found
          </p>
        )}
      </div>

      {/* 🔹 Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-3xl p-6 shadow-lg">
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
              {/* Payment Info */}
              <FormSection title="Payment Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="1 Year Charge"
                    value={`₹ ${selectedStore.oneYearCharges}`}
                    readOnly
                  />
                  <InputField
                    label="Renewal Amount"
                    value={`₹ ${selectedStore.renewalAmount}`}
                    readOnly
                  />
                  <InputField
                    label="Recieved Payment"
                    value={`₹ ${selectedStore.receivedAmount}`}
                    readOnly
                  />
                  <InputField
                    label="Pending Amount"
                    value={`₹ ${selectedStore.pendingAmount}`}
                    readOnly
                  />
                </div>
              </FormSection>

              {/* Payment Input */}
              <FormSection title="Update Payment">
                <InputField
                  label="Enter Paid Amount"
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </FormSection>

              {/* Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handlePaymentUpdate}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Update Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountPending;
