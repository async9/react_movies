import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import useImgCollection from "../../composables/useImgCollection";
import "../Navbar/Navbar.css";

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  const { imgData, getImgCollection } = useImgCollection();

  const [showMenu, setShowMenu] = useState(false);

  const userId = authCtx.userData.localId;
  const isLoggedIn = authCtx.authLogin.isLoggedIn;
  const isLoggedOut = authCtx.authLogin.logout;

  useEffect(() => {
    getImgCollection(userId);
  }, []);

  const handleShowMenu = () => {
    showMenu ? setShowMenu(false) : setShowMenu(true);
  };

  // hide menu when clicking on links
  const handleNavbar = (e) => {
    if (
      e.target.classList.contains("navbar__link") ||
      e.target.classList.contains("navbar__user-img") ||
      e.target.classList.contains("btn")
    ) {
      setShowMenu(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__menu">
        <div className="logo-container">
          <i className="logo fab fa-react"></i>
          <h3 className="logo-text">React Movies</h3>
        </div>
        <div
          onClick={handleNavbar}
          className={`navbar__container ${
            showMenu ? "navbar__container" : "navbar__container--hide"
          }`}
        >
          <div className="navbar__sub-container">
            <ul className="navbar__links">
              <li>
                <NavLink
                  to="/"
                  exact={true}
                  className="navbar__link"
                  activeClassName="active-route"
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/movies"
                  className="navbar__link"
                  activeClassName="active-route"
                >
                  Movies
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/tv-shows"
                  className="navbar__link"
                  activeClassName="active-route"
                >
                  TV Shows
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="navbar__auth">
            {!isLoggedIn && (
              <div>
                <button onClick={authCtx.showAuthHandler} className="btn">
                  Log in
                </button>
              </div>
            )}

            {isLoggedIn && (
              <Link to={`/profile/${userId}`}>
                {imgData && (
                  <img
                    src={imgData.url}
                    className="navbar__user-img"
                    alt="profile-img"
                  />
                )}
                {!imgData && <div className="navbar__user-img-default"></div>}
              </Link>
            )}
            {isLoggedIn && (
              <button onClick={isLoggedOut} className="btn">
                Log out
              </button>
            )}
          </div>
        </div>

        <button onClick={handleShowMenu} type="button" className="burger-menu">
          <div
            className={`burger-menu__line-1 ${
              showMenu ? "burger-menu__line-1--active" : "burger-menu__line-1"
            }`}
          ></div>
          <div
            className={`burger-menu__line-2 ${
              showMenu ? "burger-menu__line-2--active" : "burger-menu__line-2"
            }`}
          ></div>
          <div
            className={`burger-menu__line-3 ${
              showMenu ? "burger-menu__line-3--active" : "burger-menu__line-3"
            }`}
          ></div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
