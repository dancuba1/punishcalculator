import React, { useState } from "react";

function Dropdown({ selected, setSelected, options = [] }) {
  const [isActive, setIsActive] = useState(false);
  for(const option of options){ 
    console.log("Options " + option);
  };
  
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
              {typeof option === 'object' ? option.name : option} {/* Adjust based on the structure */}

            </div>
          ))}
        </div>
      )}
    </div>
  );

}
  

export default Dropdown;
