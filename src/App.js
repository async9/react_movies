import { useContext } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import reactDom from "react-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./views/Home/Home";
import Movies from "./views/Discover/Movies";
import TvShows from "./views/Discover/TvShows";
import SearchResults from "./views/SearchResults/SearchResults";
import MovieDetails from "./views/MovieTvDetails/MovieDetails";
import TvDetails from "./views/MovieTvDetails/TvDetails";
import Profile from "./views/Profile/Profile";
import MainFooter from "./components/MainFooter/MainFooter";
import AuthForm from "./components/AuthForm/AuthForm";
import AuthMessage from "./components/AuthMessage/AuthMessage";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        {reactDom.createPortal(
          <AuthMessage />,
          document.getElementById("message")
        )}

        {authCtx.showAuth &&
          reactDom.createPortal(
            <AuthForm />,
            document.getElementById("auth-modal")
          )}

        <Navbar />

        <div className="main-container">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>

            <Route exact path="/search-results/:searchId">
              <SearchResults />
            </Route>

            <Route exact path="/movies">
              <Movies />
            </Route>

            <Route exact path="/tv-shows">
              <TvShows />
            </Route>

            <Route exact path="/movie-details/:itemId">
              <MovieDetails />
            </Route>

            <Route exact path="/tv-details/:itemId">
              <TvDetails />
            </Route>

            {authCtx.authLogin.isLoggedIn && (
              <Route exact path="/profile/:userId">
                <Profile />
              </Route>
            )}

            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>

        <MainFooter />
      </div>
    </Router>
  );
}

export default App;
