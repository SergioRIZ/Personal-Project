import React from "react";

interface Props {
  id: string; name: string; type?: string; label: string;
  value: string; onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string | null; placeholder?: string; icon?: React.ReactNode;
}

const FormInput = ({ id, name, type = "text", label, value, onChange, error, placeholder, icon }: Props) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm">
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
          className={`py-3 ${icon ? 'pl-10' : 'pl-3'} w-full border ${
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300 dark:placeholder-red-500'
              : 'border-gray-300 bg-white focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-green-400 dark:focus:border-green-400'
          } rounded-xl shadow-sm transition-colors duration-200`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;