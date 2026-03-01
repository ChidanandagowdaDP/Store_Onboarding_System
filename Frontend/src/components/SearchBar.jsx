import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Trigger search immediately while typing
  };

  return (
    <div className="flex justify-end items-end m-1">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        className="w-full md:w-64 py-1 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
    </div>
  );
};

export default SearchBar;
