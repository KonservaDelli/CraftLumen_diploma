import React, { useState } from 'react';
import './SearchProject.css';

const SearchProject = ({ onSearch, placeholder = "Пошук" }) => {
  const [query, setQuery] = useState("");

  const handleSearchTrigger = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchTrigger();
    }
  };

  return (
    <div className="search-project-wrapper">
      <input
        type="text"
        className="search-project-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="search-project-icon-box" onClick={handleSearchTrigger}>
        <img 
          src="/search-icon.png" 
          alt="search" 
          className="search-project-icon-img" 
        />
      </div>
    </div>
  );
};

export default SearchProject;