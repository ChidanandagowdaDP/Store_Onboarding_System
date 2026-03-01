import React from "react";

const FormSection = ({ title, columns = 3, children }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-sky-600 border-l-4 border-sky-500 pl-2">
        {title}
      </h3>

      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
