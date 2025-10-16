import React from "react";

// Define constants for alert types
export const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

const Alert = ({ type = ALERT_TYPES.INFO, message, onClose }) => {
  const colors = {
    [ALERT_TYPES.SUCCESS]: "bg-green-100 text-green-800",
    [ALERT_TYPES.ERROR]: "bg-red-100 text-red-800",
    [ALERT_TYPES.WARNING]: "bg-yellow-100 text-yellow-800",
    [ALERT_TYPES.INFO]: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`p-4 rounded-md ${colors[type]} flex justify-between items-center`}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="font-bold ml-4">
          X
        </button>
      )}
    </div>
  );
};

export default Alert;