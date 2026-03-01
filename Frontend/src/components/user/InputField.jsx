import React from "react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  readOnly = false,
  placeholder = "",
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value || ""}
        placeholder={placeholder}
        onChange={readOnly ? undefined : onChange}
        readOnly={readOnly}
        disabled={readOnly}
        required={required}
        className={`w-full px-3 py-2 rounded-lg border transition text-sm
          ${
            readOnly
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "focus:outline-none focus:ring-2 focus:ring-sky-400"
          }
        `}
      />
    </div>
  );
};

export default InputField;
