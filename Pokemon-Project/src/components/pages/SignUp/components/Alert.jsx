import React from "react";
import { Link } from "../../../../Link";

const AlertTypes = {
  SUCCESS: "success",
  ERROR: "error",
};

const Alert = ({ type, message, action }) => {
  const getAlertStyles = () => {
    switch (type) {
      case AlertTypes.SUCCESS:
        return {
          container: "bg-green-50 border-l-4 border-green-500 text-green-700",
          icon: (
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          actionBtn: "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500",
        };
      case AlertTypes.ERROR:
        return {
          container: "bg-red-50 border-l-4 border-red-500 text-red-700",
          icon: (
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ),
          actionBtn: "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500",
        };
      default:
        return {
          container: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
          icon: null,
          actionBtn: "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500",
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`mb-6 p-4 ${styles.container} rounded-r-lg`}>
      <div className="flex justify-between">
        <div className="flex">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
        {action && (
          <div>
            <Link
              to={action.to}
              className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${styles.actionBtn} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {action.label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.types = AlertTypes;

export default Alert;