import React from "react";

const FormField = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  placeholder,
  error,
  icon,
  rightElement,
  className = ""
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`py-3 ${icon ? 'pl-10' : 'pl-3'} ${rightElement ? 'pr-10' : 'pr-3'} w-full border ${
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } rounded-xl shadow-sm`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;