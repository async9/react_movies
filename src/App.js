import { useContext } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Movies from "./views/Movies";
import TvShows from "./views/TvShows";
import SearchResults from "./views/SearchResults";
import MovieDetails from "./views/MovieDetails";
import TvDetails from "./views/TvDetails";
import Profile from "./views/Profile";
import MainFooter from "./components/MainFooter";
import AuthForm from "./components/AuthForm";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Navbar />
        {authCtx.showAuth && <AuthForm />}

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
