import React, { useState, useEffect, useRef } from "react";

function Dropdown({ selected, setSelected, options = [], placeholder }) {
  const [isActive, setIsActive] = useState(false);
  const [filter, setFilter] = useState(""); // To store the user input
  const inputRef = useRef(null); // Reference to the input
  const blurTimeoutRef = useRef(null);

  const getOptionName = (option) => (typeof option === 'object' ? option.name : option);

  // determine whether the provided `selected` actually exists in options
  const isSelectedValid = (() => {
    if (!selected) return false;
    // normalize selected to string name when it's an object or string
    const selectedName = typeof selected === "string" ? selected : getOptionName(selected);
    return options.some((opt) => getOptionName(opt) === selectedName);
  })();

  const trySelectExact = () => {
    const trimmed = filter.trim().toLowerCase();
    if (!trimmed) return false;
    const match = options.find((opt) => getOptionName(opt).toLowerCase() === trimmed);
    if (match) {
      const name = getOptionName(match);
      setSelected(name);
      setFilter(name);
      setIsActive(false);
      return true;
    }
    return false;
  };

  // keep input in sync when external selected changes, but only if it's a real option
  useEffect(() => {
    if (isSelectedValid) {
      const name = typeof selected === "string" ? selected : getOptionName(selected);
      setFilter(name);
    } else {
      // if selected is not a valid option (e.g. "Select Character"), clear displayed input
      setFilter("");
    }
  }, [selected, isSelectedValid]); // re-run if selected or options change (via isSelectedValid)

  // Filter options based on the user's input
  const filteredOptions = options.filter((option) =>
    typeof option === 'object'
      ? option.name.toLowerCase().includes(filter.toLowerCase())
      : option.toLowerCase().includes(filter.toLowerCase())
  );

  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const maxWidth = inputRef.current?.offsetWidth || 200;
    const textLength = (filter || "").length;
    // Simple logic: shrink font if text is long
    let newFontSize = 20;
    if (textLength > 20) newFontSize = Math.max(12, 20 - (textLength - 20) * 0.5);
    setFontSize(newFontSize);
  }, [filter]);

  // Focus on the input when dropdown is activated
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // cleanup blur timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  // display placeholder unless selected is a real option
  const inputPlaceholder = isSelectedValid ? (typeof selected === "string" ? selected : getOptionName(selected)) : placeholder;

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
          onChange={(e) => {
            setFilter(e.target.value);
            // ensure dropdown opens while typing
            if (!isActive) setIsActive(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              trySelectExact();
            }
          }}
          onFocus={() => {
            // open when input is focused
            setIsActive(true);
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
              blurTimeoutRef.current = null;
            }
          }}
          onBlur={() => {
            // delay exact-match selection slightly so clicks on options aren't blocked
            blurTimeoutRef.current = setTimeout(() => {
              trySelectExact();
              blurTimeoutRef.current = null;
            }, 120);
          }}
          placeholder={inputPlaceholder}
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
                onMouseDown={(e) => {
                  // use onMouseDown to set selection before blur fires
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