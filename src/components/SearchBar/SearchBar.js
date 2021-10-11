import { useRef } from "react";
import "../SearchBar/SearchBar.css";

const SearchBar = (props) => {
  const searchValue = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.onHomeSearch) {
      props.onHomeSearch(searchValue.current.value);
      searchValue.current.value = "";
    }
    if (props.onMovieSearch) {
      props.onMovieSearch(searchValue.current.value);
      searchValue.current.value = "";
    }
    if (props.onTvSearch) {
      props.onTvSearch(searchValue.current.value);
      searchValue.current.value = "";
    }
    if (props.onMultiSearch) {
      props.onMultiSearch(searchValue.current.value);
      searchValue.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search">
      <input
        ref={searchValue}
        className="search__input search--input-results"
        type="text"
        placeholder="Search..."
      />
      <div className="search__btn-bg">
        <button className="btn btn--search">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;
