import React from "react";

const Search = () => {
  return (
    <div className="hidden w-full max-w-xl lg:block">
      <form className="flex  relative">
        <span className="absolute top-3 left-2 text-gray-400">
          <i className="fa fa-search"></i>
        </span>
        <input
          className="w-full rounded-l-md px-8 focus:outline-none focus:ring-0 focus:ring-primary border border-primary"
          type="text"
          placeholder="search"
        />
        <button className="text-white rounded-r-md bg-primary border border-primary px-10 py-3 hover:bg-transparent hover:text-primary transition ease-in 700 ">
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
