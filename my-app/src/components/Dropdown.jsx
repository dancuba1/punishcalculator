
import React, { useState, useEffect, useRef } from "react";

function Dropdown({ selected, setSelected, options = [] }) {
  const [isActive, setIsActive] = useState(false);
  const [filter, setFilter] = useState(""); // To store the user input
  const inputRef = useRef(null); // Reference to the input

  // Filter options based on the user's input
  const filteredOptions = options.filter((option) =>
    typeof option === 'object'
      ? option.name.toLowerCase().includes(filter.toLowerCase())
      : option.toLowerCase().includes(filter.toLowerCase())
  );

  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const maxWidth = inputRef.current?.offsetWidth || 200;
    const textLength = selected.length;
    // Simple logic: shrink font if text is long
    let newFontSize = 20;
    if (textLength > 20) newFontSize = Math.max(12, 20 - (textLength - 20) * 0.5);
    setFontSize(newFontSize);
  }, [selected]);

  // Focus on the input when dropdown is activated
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <div className="dropdown">
      <div
        className="dropdown-button"
        onClick={() => setIsActive(!isActive)}
      >
        <input
          ref={inputRef}
          type="text"
          style={{ fontSize: `${fontSize}px` }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={selected || "Select an option"}
          onClick={(e) => e.stopPropagation()} // Prevent closing the dropdown when clicking input
          className="dropdown-input"
        />
        <span className="fas fa-caret-down"></span>
      </div>

      {isActive && (
        <div className="dropdown-content">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  const selectedOption = typeof option === 'object' ? option.name : option;
                  setSelected(selectedOption);
                  setFilter(selectedOption); // Update filter with selected value
                  setIsActive(false);
                }}
                className="dropdown-item"
              >
                {typeof option === 'object' ? option.name : option}
              </div>
            ))
          ) : (
            <div className="dropdown-item">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

/*
import React, { useState } from "react";

function Dropdown({ selected, setSelected, options = [] }) {
  const [isActive, setIsActive] = useState(false);
  const [val, setVal] = useState('');
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
              {typeof option === 'object' ? option.name : option} 

            </div>
          ))}
        </div>
      )}
    </div>
  );

}
  

export default Dropdown;

*/


/*import React, { useState, useEffect, useRef } from "react";

function Dropdown({ selected, setSelected, options = [] }) {
  const [isActive, setIsActive] = useState(false);
  const [filter, setFilter] = useState(""); // To store the user input
  const inputRef = useRef(null); // Reference to the input

  // Filter options based on the user's input
  const filteredOptions = options.filter((option) =>
    typeof option === 'object'
      ? option.name.toLowerCase().includes(filter.toLowerCase())
      : option.toLowerCase().includes(filter.toLowerCase())
  );

  // Focus on the input when dropdown is activated
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <div className="dropdown">
      <div
        className="dropdown-button"
        onClick={() => setIsActive(!isActive)}
      >
        <input
          ref={inputRef}
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={selected || "Select an option"}
          onClick={(e) => e.stopPropagation()} // Prevent closing the dropdown when clicking input
          className="dropdown-input"
        />
        <span className="fas fa-caret-down"></span>
      </div>

      {isActive && (
        <div className="dropdown-content">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  const selectedOption = typeof option === 'object' ? option.name : option;
                  setSelected(selectedOption);
                  setFilter(selectedOption); // Update filter with selected value
                  setIsActive(false);
                }}
                className="dropdown-item"
              >
                {typeof option === 'object' ? option.name : option}
              </div>
            ))
          ) : (
            <div className="dropdown-item">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
*/