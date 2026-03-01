import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import SuccessModal from "../../components/SuccessModal";
import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";
import SelectField from "../../components/user/SelectField";
import RadioGroupField from "../../components/user/RadioGroupField";

const CreateStore = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const initialState = {
    groupName: "",
    storeName: "",
    address: "",
    geoAddress: "",
    pincode: "",
    district: "",
    storeType: "",
    ksbclId: "",
    ksbclPassword: "",
    laneAvailable: "no",
    lanes: "",
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    cashierName: "",
    cashierMobile: "",
    goLiveDate: "",
    oneYearCharges: "",
    renewalAmount: "",
    systemRequired: "no",
    systemAmount: "",
    leadGivenBy: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        `${BACKEND_URL}/api/store/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 201) {
        setModalVisible(true);
        setFormData(initialState);
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const closeModal = () => setModalVisible(false);

  return (
    <div className="bg-gray-100 min-h-screen p-2">
      <SuccessModal
        title="Store Created 🎉"
        visible={modalVisible}
        onClose={closeModal}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-sky-600 mb-6">
          Create Store
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label="Group Name"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                required
              />

              <InputField
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                required
              />

              <SelectField
                label="Store Type"
                name="storeType"
                value={formData.storeType}
                onChange={handleChange}
                options={["CL2", "CL7", "CL9"]}
                required
              />

              <InputField
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              />

              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <InputField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                type="number"
                required
              />

              <InputField
                label="Geo Address"
                name="geoAddress"
                value={formData.geoAddress}
                onChange={handleChange}
                required
              />

              <InputField
                label="Go Live Date"
                name="goLiveDate"
                value={formData.goLiveDate}
                onChange={handleChange}
                type="date"
                required
              />
            </div>
          </FormSection>

          {/* KSBCL Details */}
          <FormSection title="KSBCL Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="KSBCL ID"
                name="ksbclId"
                value={formData.ksbclId}
                onChange={handleChange}
                required
              />

              <InputField
                label="KSBCL Password"
                name="ksbclPassword"
                value={formData.ksbclPassword}
                onChange={handleChange}
                required
              />
            </div>
          </FormSection>

          {/* Lane Information */}
          <FormSection title="Lane Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioGroupField
                label="Lane Available"
                name="laneAvailable"
                value={formData.laneAvailable}
                onChange={handleChange}
              />

              {formData.laneAvailable === "yes" && (
                <SelectField
                  label="No. of Lanes"
                  name="lanes"
                  value={formData.lanes}
                  onChange={handleChange}
                  options={["1", "2", "3"]}
                  required
                />
              )}
            </div>
          </FormSection>

          {/* Owner & Cashier */}
          <FormSection title="Owner & Cashier">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
              <InputField
                label="Owner Mobile"
                name="ownerMobile"
                value={formData.ownerMobile}
                onChange={handleChange}
                required
              />
              <InputField
                label="Owner Email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                type="email"
              />
              <InputField
                label="Cashier Name"
                name="cashierName"
                value={formData.cashierName}
                onChange={handleChange}
                required
              />
              <InputField
                label="Cashier Mobile"
                name="cashierMobile"
                value={formData.cashierMobile}
                onChange={handleChange}
                required
              />
            </div>
          </FormSection>

          {/* Financial Details */}
          <FormSection title="Financial Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label="1 Year Charges (₹)"
                name="oneYearCharges"
                value={formData.oneYearCharges}
                onChange={handleChange}
                type="number"
                required
              />

              <InputField
                label="Renewal Amount (₹)"
                name="renewalAmount"
                value={formData.renewalAmount}
                onChange={handleChange}
                type="number"
                required
              />

              <RadioGroupField
                label="System Required"
                name="systemRequired"
                value={formData.systemRequired}
                onChange={handleChange}
              />

              {formData.systemRequired === "Yes" && (
                <InputField
                  label="System Amount (₹)"
                  name="systemAmount"
                  value={formData.systemAmount}
                  onChange={handleChange}
                  type="number"
                  required
                />
              )}
            </div>
          </FormSection>

          {/* Lead & Onboarding */}
          <FormSection title="Lead & Onboarding">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Lead Given By"
                name="leadGivenBy"
                value={formData.leadGivenBy}
                onChange={handleChange}
                required
              />
              <InputField
                label="Onboarded By"
                name="onboardedBy"
                value={Cookies.get("username")}
                readOnly
              />
            </div>
          </FormSection>

          {/* Submit Button */}
          <div className="col-span-full flex justify-center pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
            >
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
