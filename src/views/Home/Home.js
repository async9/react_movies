import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import SearchBar from "../../components/SearchBar/SearchBar";
import useMultiData from "../../composables/useMultiData";
import Card from "../../components/Card/Card";
import Spinner from "../../components/Spinner/Spinner";
import "../Home/Home.css";

const Home = () => {
  const authCtx = useContext(AuthContext);
  const route = useHistory();

  const userId = authCtx.userData.localId;

  // api urls
  const apiTheaterMovies = `https://api.themoviedb.org/3/movie/upcoming?api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&language=en-US&page=1`;
  const apiOnTv = `https://api.themoviedb.org/3/tv/on_the_air?api_key=9794e8bb02ba77223f102a1ab8f4e97d&include_adult=false&language=en-US&page=`;

  const urls = [apiTheaterMovies, apiOnTv];

  const { dataOne, dataTwo, getMultiData, isPending, error } = useMultiData();

  // redirect to results after search
  const homeSearchValue = (value) => {
    route.push(`search-results/${value}`);
  };

  useEffect(() => {
    getMultiData(urls);
  }, []);

  return (
    <div className="home">
      <header className="home__welcome">
        <div className="home__welcome-bg"></div>
        <h2 className="home__welcome-text">Welcome</h2>
        <h1 className="home__welcome-title">
          Search for Movies and TV Shows <br /> Log in or sign in, to favorite
          movies and tv shows. <br /> Leave a review, and read other people
          reviews.
        </h1>
        <SearchBar onHomeSearch={homeSearchValue} />
      </header>

      <main>
        <div className="home__movie-list">
          <h2 className="home__list-title">What's in theaters</h2>
          {isPending && <Spinner />}
          {error && <p className="error">{error}</p>}
          {dataOne && (
            <div className="home__data-list">
              {dataOne.results.map((item) => (
                <React.Fragment key={item.id}>
                  {item.poster_path && <Card item={item} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="home__banner">
          <div className="home__bg"></div>
          {!authCtx.authLogin.isLoggedIn && (
            <h2 className="home__banner-title">
              Sign up or log in <br /> Add Movies and TV shows to favorites.{" "}
              <br />
              Leave a review.
            </h2>
          )}

          {authCtx.authLogin.isLoggedIn && (
            <h2 className="home__banner-title">
              Add to favorite your Movies and TV Shows
            </h2>
          )}

          <>
            {!authCtx.authLogin.isLoggedIn && (
              <div>
                <button
                  onClick={authCtx.showAuthHandler}
                  className="btn btn--home-banner"
                >
                  Login
                </button>
              </div>
            )}

            {authCtx.authLogin.isLoggedIn && (
              <>
                <div className="home__banner-info">
                  <p className="home__banner-title">Go to</p>
                  <Link to={`/profile/${userId}`}>
                    <h3 className="home__banner-profile-link">Your profile</h3>
                  </Link>
                </div>
                <p className="home__banner-title">
                  to see your favorite collections
                </p>
              </>
            )}
          </>
        </div>

        <div className="home__tv-list">
          <h2 className="home__list-title">What's on TV</h2>
          {isPending && <Spinner />}
          {error && <p className="error">{error}</p>}
          {dataTwo && (
            <div className="home__data-list">
              {dataTwo.results.map((item) => (
                <React.Fragment key={item.id}>
                  {item.poster_path && <Card item={item} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
