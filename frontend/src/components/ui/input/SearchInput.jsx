import React, { useState, useRef, useEffect } from 'react';
import './SearchInput.css';

const SearchInput = ({ 
  onSearch, 
  placeholder = "Пошук...", 
  showIcon = true, 
  suggestions = [], 
  onSuggestionSelect,
  value
}) => {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    if (onSearch) onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setIsOpen(false);
    if (onSuggestionSelect) onSuggestionSelect(suggestion);
  };

  const isDropdownVisible = isOpen && query && suggestions.length > 0;

  return (
    <div className="search-input-wrapper" ref={wrapperRef}>
      {/* drop-open прибирає заокруглення коли відкрито список */}
      <div className={`search-input-container ${isDropdownVisible ? 'drop-open' : ''}`}>
        <input
          type="text"
          className="search-input-field"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        {showIcon && (
          <div className="search-input-icon-box" onClick={() => onSearch?.(query)}>
            <img src="/search-icon.png" alt="search" className="search-input-icon-img" />
          </div>
        )}
      </div>

      {isDropdownVisible && (
        <ul className="search-suggestions-list">
          {suggestions.map((item, index) => (
            <li 
              key={index} 
              className="search-suggestion-item"
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;