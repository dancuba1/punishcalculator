import React, { useState, useEffect, useRef } from "react";

function Dropdown({ selected, setSelected, options = [], placeholder = "Select..." }) {
  const [isActive, setIsActive] = useState(false);
  const [filter, setFilter] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef(null);
  const optionRefs = useRef([]); // array of refs to option DOM nodes
  const containerRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  // utility to get name string
  const getOptionName = (opt) => (typeof opt === "object" ? opt.name : opt);

  // filtered list
  const filteredOptions = options.filter((opt) =>
    getOptionName(opt).toLowerCase().includes((filter || "").toLowerCase())
  );

  // ensure optionRefs length matches filteredOptions
  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, filteredOptions.length);
  }, [filteredOptions.length]);

  // when focusedIndex changes, move DOM focus to that option (if visible)
  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex].focus();
    } else if (focusedIndex === -1 && inputRef.current) {
      // return focus to input (optional)
      inputRef.current.focus();
    }
  }, [focusedIndex]);

  // open dropdown and focus input when active toggled
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // close when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsActive(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectOption = (option) => {
    const name = getOptionName(option);
    setSelected(name);
    setFilter(name);
    setIsActive(false);
    setFocusedIndex(-1);
  };

  const trySelectExact = () => {
    const trimmed = (filter || "").trim().toLowerCase();
    if (!trimmed) return false;
    const match = options.find((opt) => getOptionName(opt).toLowerCase() === trimmed);
    if (match) {
      selectOption(match);
      return true;
    }
    return false;
  };

  const onInputKeyDown = (e) => {
    switch (e.key) {
      case "Tab":
        // if you want Tab to open and focus first option: prevent default
        console.log("Tab pressed");
        if (!isActive) {
          e.preventDefault();
          setIsActive(true);
          setTimeout(() => setFocusedIndex(filteredOptions.length > 0 ? 0 : -1), 0);
        } else {
          // if already open, move focus to first option
          e.preventDefault();
          setFocusedIndex(filteredOptions.length > 0 ? 0 : -1);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!isActive) {
          setIsActive(true);
          setFocusedIndex(filteredOptions.length > 0 ? 0 : -1);
        } else {
          setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (!isActive) {
          setIsActive(true);
          setFocusedIndex(filteredOptions.length > 0 ? filteredOptions.length - 1 : -1);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        }
        break;

      case "Enter":
        console.log("Enter pressed");
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          selectOption(filteredOptions[focusedIndex]);
        } else {
          trySelectExact();
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsActive(false);
        setFocusedIndex(-1);
        break;

      default:
        // allow normal typing
        break;
    }
  };

  // handle blur: small timeout so clicks on options succeed
  const onInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsActive(false);
        setFocusedIndex(-1);
      }
    }, 120);
  };
  const onInputFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsActive(true);
  };

  return (
    <div className="dropdown" ref={containerRef}>
      <div className="dropdown-button" onClick={() => setIsActive((s) => !s)}>
        <input
          ref={inputRef}
          className="dropdown-input"
          type="text"
          value={filter}
          placeholder={placeholder}
          onChange={(e) => {
            setFilter(e.target.value);
            setIsActive(true);
            setFocusedIndex(-1);
          }}
          onKeyDown={onInputKeyDown}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          aria-expanded={isActive}
          aria-haspopup="listbox"
          role="combobox"
        />
        <span className="caret" aria-hidden>▾</span>
      </div>

      {isActive && (
        <div className="dropdown-content" role="listbox" aria-label="Options">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const name = getOptionName(opt);
              return (
                <div
                  key={name + idx}
                  role="option"
                  aria-selected={focusedIndex === idx}
                  tabIndex={-1} // not in normal tab flow
                  ref={(el) => (optionRefs.current[idx] = el)}
                  className={`dropdown-item ${focusedIndex === idx ? "focused" : ""}`}
                  onMouseDown={(e) => {
                    // onMouseDown to avoid blur-before-click
                    e.preventDefault(); // prevent focus change stickiness
                    selectOption(opt);
                  }}
                  onMouseEnter={() => setFocusedIndex(idx)} // hover updates highlight
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      selectOption(opt);
                    }
                  }}
                >
                  {name}
                </div>
              );
            })
          ) : (
            <div className="dropdown-item no-options">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
