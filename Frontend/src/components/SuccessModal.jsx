import React from "react";

const SuccessModal = ({ title, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-semibold text-green-600 mb-4">
          {title} Successfully!
        </h2>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
