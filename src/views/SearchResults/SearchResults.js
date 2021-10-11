import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/Card/Card";
import useData from "../../composables/useData";
import Spinner from "../../components/Spinner/Spinner";
import SearchBar from "../../components/SearchBar/SearchBar";
import "../SearchResults/SearchResults.css";

const SearchResults = () => {
  // route
  const { searchId } = useParams();
  // state
  const [searchValue, setSearchValue] = useState(searchId);
  const [searchPage, setSearchPage] = useState(1);

  const apiSearch = `https://api.themoviedb.org/3/search/multi?api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&query=${searchValue}&page=${searchPage}`;

  // extracting API data
  const { data, isPending, error, getData } = useData();

  // get emit value
  const handleSearchSubmit = (value) => {
    setSearchValue(value);
  };

  useEffect(() => {
    getData(apiSearch);
    window.scrollTo(0, 0);
  }, [searchPage]);

  useEffect(() => {
    setSearchPage(1);
    getData(apiSearch);
  }, [searchValue]);

  return (
    <div className="result">
      <header className="result__header">
        <div className="result__header-info">
          <h2 className="result__list-title">Search</h2>
          <h2 className="result__search-text">
            results for: <span className="result-words">{searchValue}</span>
          </h2>
        </div>
        <SearchBar onMultiSearch={handleSearchSubmit} />
        <h3 className="result__text-info">
          Click on Movies or TV Shows, if you want more search options dedicated
          to movies or tv shows. This is just a general search.
        </h3>
      </header>

      <main>
        <div className="result__data-list-container">
          {isPending && <Spinner />}
          {error && <p className="error">{error}</p>}
          {data && (
            <div className="result__data-list">
              {data.results.map((item) => (
                <React.Fragment key={item.id}>
                  {item.poster_path && <Card item={item} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {data && (
          <div className="page-chevron-container">
            {searchPage > 1 && (
              <button
                onClick={() => setSearchPage(searchPage - 1)}
                className="btn__chevron"
              >
                <i className="page-chevron fas fa-chevron-left"></i>
              </button>
            )}
            <p className="page-counter">{searchPage} ...</p>
            {searchPage !== data.total_pages && (
              <button
                onClick={() => setSearchPage(searchPage + 1)}
                className="btn__chevron"
              >
                <i className="page-chevron fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
