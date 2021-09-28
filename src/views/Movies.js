import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import useData from "../composables/useData";
import MovieTags from "../components/MovieTags";
import Spinner from "../components/Spinner";
import "../styles/Discover.css";
import "../styles/Filter.css";

const Movies = () => {
  // state
  const [tagId, setTagId] = useState();
  const [sort, setSort] = useState("popular");
  const [searchPage, setSearchPage] = useState(1);
  const [searchValue, setSearchValue] = useState();
  const [gearIcon, setGearIcon] = useState(false);

  // api urls
  const apiSearch = `https://api.themoviedb.org/3/search/movie?api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&query=${searchValue}&page=${searchPage}`;
  const apiPopularMovies = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&page=${searchPage}`;
  const apiUpcomingMovies = `https://api.themoviedb.org/3/movie/upcoming?api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&language=en-US&page=${searchPage}`;
  const apiTopRatedMovies = `https://api.themoviedb.org/3/movie/top_rated?api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&language=en-US&page=${searchPage}`;
  const apiMovieDiscover = `https://api.themoviedb.org/3/discover/movie?api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&with_genres=${tagId}&language=en-US&include_adult=false&page=${searchPage}`;

  // extracting API data
  const { data, isPending, error, getData } = useData();

  // get emited tag id value
  const getTagId = (value) => {
    setTagId(value);
    setSort("genres");
    setGearIcon(false);
  };

  // get emited value
  const movieSearchValue = (value) => {
    setSearchValue(value);
    setSort("search_results");
  };

  // getting API data
  const retrieveData = () => {
    switch (sort) {
      case "popular":
        getData(apiPopularMovies);
        setTagId("");
        setSearchValue("");
        setGearIcon(false);
        break;
      case "upcoming":
        getData(apiUpcomingMovies);
        setTagId("");
        setSearchValue("");
        setGearIcon(false);
        break;
      case "top_rated":
        getData(apiTopRatedMovies);
        setTagId("");
        setSearchValue("");
        setGearIcon(false);
        break;
      case "genres":
        getData(apiMovieDiscover);
        setSearchValue("");
        setGearIcon(false);
        break;
      case "search_results":
        getData(apiSearch);
        setTagId("");
        setGearIcon(false);
        break;
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
          <form className="filter">
            <label className="filter__title">Sort results by</label>
            <select
              onChange={(e) => {
                setSort(e.target.value);
              }}
              value={sort}
              className="filter__select"
            >
              <option value="popular" className="filter__option">
                Popular
              </option>
              <option value="upcoming" className="filter__option">
                Upcoming
              </option>
              <option value="top_rated" className="filter__option">
                Top rated
              </option>
              {tagId && (
                <option value="genres" className="filter__option">
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
          <MovieTags onTagClick={getTagId} tagId={tagId} />
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
                <h2 className="discover__list-title">Movies</h2>
              </div>
              {searchValue && (
                <h2 className="discover__search-text">
                  Search results for:
                  <span className="result-words">{searchValue}</span>
                </h2>
              )}
            </div>
            <SearchBar onMovieSearch={movieSearchValue} />
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

export default Movies;
