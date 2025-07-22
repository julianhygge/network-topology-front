// components/TransformerForm/FormField.js
import React from "react";

const FormField = ({ label, name, register, errors, validationRules, disabled = false, ...rest }) => {
  const error = errors[name];
  const borderClass = error ? "border-red-500" : "border-gray-200";
  const disabledClass = disabled ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-white";

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        className={`block w-full rounded-lg p-3 text-sm shadow-sm ${borderClass} ${disabledClass} focus:border-indigo-500 focus:ring-indigo-500 transition`}
        disabled={disabled}
        {...register(name, validationRules)}
        {...rest}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error.message}</span>}
    </div>
  );
};

export default FormField;