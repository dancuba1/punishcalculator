import React, { useState } from "react";

function Dropdown({ selected, setSelected, options = [] }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="dropdown">
      <div
        className="dropdown-button"
        onClick={() => {
          setIsActive(!isActive);
          console.log("Clicked");
        }}
      >
        {selected}
        <span className="fas fa-caret-down"></span>
      </div>
      {isActive && (
        <div className="dropdown-content">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected(option);
                console.log("Clicked", option);
                setIsActive(false);
              }}
              className="dropdown-item"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
