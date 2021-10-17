import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import SearchBar from "../../components/SearchBar/SearchBar";
import useData from "../../composables/useData";
import TvTags from "../../components/TagGenres/TvTags";
import Spinner from "../../components/Spinner/Spinner";
import "../Discover/Discover.css";

const TvShows = () => {
  // state
  const [tagId, setTagId] = useState();
  const [sort, setSort] = useState("popular");
  const [searchPage, setSearchPage] = useState(1);
  const [searchValue, setSearchValue] = useState();
  const [gearIcon, setGearIcon] = useState(false);

  // api urls
  const apiSearch = `https://api.themoviedb.org/3/search/tv?api_key=its-secret&include_adult=false&query=${searchValue}&page=${searchPage}`;
  const apiPopularTv = `https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=its-secret&include_adult=false&page=${searchPage}`;
  const apiOnTv = `https://api.themoviedb.org/3/tv/on_the_air?api_key=its-secret&include_adult=false&language=en-US&page=${searchPage}`;
  const apiTopRatedTv = `https://api.themoviedb.org/3/tv/top_rated?api_key=its-secret&include_adult=false&language=en-US&page=${searchPage}`;
  const apiTvDiscover = `https://api.themoviedb.org/3/discover/tv?api_key=its-secret&include_adult=false&with_genres=${tagId}&language=en-US&include_adult=false&page=${searchPage}`;

  // extracting API data
  const { data, isPending, error, getData } = useData();

  // get emited tag id value
  const getTagId = (value) => {
    setTagId(value);
    setSort("genres");
    setGearIcon(false);
  };

  // get emited value
  const tvSearchValue = (value) => {
    setSearchValue(value);
    setSort("search_results");
  };

  // getting API data
  const retrieveData = () => {
    switch (sort) {
      case "popular":
        getData(apiPopularTv);
        setTagId("");
        setSearchValue("");
        setGearIcon(false);
        break;
      case "upcoming":
        getData(apiOnTv);
        setTagId("");
        setSearchValue("");
        setGearIcon(false);
        break;
      case "top_rated":
        getData(apiTopRatedTv);
        setTagId("");
        setSearchValue("");
        setGearIcon(false);
        break;
      case "genres":
        getData(apiTvDiscover);
        setSearchValue("");
        setGearIcon(false);
        break;
      case "search_results":
        getData(apiSearch);
        setTagId("");
        setGearIcon(false);
        break;
      default:
    }
  };

  // call data and watch for changes
  useEffect(() => {
    retrieveData();
    window.scrollTo(0, 0);
  }, [searchPage]);

  // reset on
  useEffect(() => {
    setSearchPage(1);
    retrieveData();
  }, [sort, tagId, searchValue]);

  const handleGearIcon = () => {
    gearIcon ? setGearIcon(false) : setGearIcon(true);
  };

  return (
    <div className="discover">
      <div className="discover__container">
        <aside
          className={`discover__aside ${
            gearIcon ? "discover__aside--active" : ""
          }`}
        >
          <form className="discover__filter">
            <label className="discover__filter-title">Sort results by</label>
            <select
              onChange={(e) => {
                setSort(e.target.value);
              }}
              value={sort}
              className="discover__filter-select"
            >
              <option value="popular" className="discover__filter-option">
                Popular
              </option>
              <option value="upcoming" className="discover__filter-option">
                Upcoming
              </option>
              <option value="top_rated" className="discover__filter-option">
                Top rated
              </option>
              {tagId && (
                <option value="genres" className="discover__filter-option">
                  Genres
                </option>
              )}
              {searchValue && (
                <option value="search_results" className="filter__option">
                  Search results
                </option>
              )}
            </select>
          </form>
          <TvTags onTagClick={getTagId} tagId={tagId} />
        </aside>

        <div>
          <header className="discover__header">
            <div className="discover__header-info">
              <div className="discover__header-wrap">
                <button onClick={handleGearIcon} type="button">
                  <i
                    className={`gear-icon fas fa-cog ${
                      gearIcon ? "gear-icon--active" : "gear-icon"
                    }`}
                  ></i>
                </button>
                <h2 className="discover__list-title">TV Shows</h2>
              </div>
              {searchValue && (
                <h2 className="discover__search-text">
                  Search results for:
                  <span className="result-words">{searchValue}</span>
                </h2>
              )}
            </div>
            <SearchBar onTvSearch={tvSearchValue} />
          </header>

          <main className="discover__data-list-container">
            {isPending && <Spinner />}
            {error && <p className="error">{error}</p>}
            {data && (
              <div className="discover__data-list">
                {data.results.map((item) => (
                  <React.Fragment key={item.id}>
                    {item.poster_path && <Card item={item} />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </main>
        </div>
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
    </div>
  );
};

export default TvShows;
