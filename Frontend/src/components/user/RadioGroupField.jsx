import React from "react";

const RadioGroupField = ({
  label,
  name,
  value,
  onChange,
  options = ["Yes", "No"],
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-600">
          {label}
        </label>
      )}

      <div className="flex gap-6 mt-1">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              className="accent-sky-500"
            />
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroupField;
