import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { projectFirestore, timestamp } from "../../firebase/firebase-init";
import AuthContext from "../../store/auth-context";
import "../Card/Card.css";

const Card = ({ item }) => {
  const authCtx = useContext(AuthContext);
  const route = useHistory();
  const apiImgPath = "https://image.tmdb.org/t/p/w300";

  const [faveIcon, setFaveIcon] = useState(false);

  const handleCardClick = (e) => {
    if (!e.target.classList.contains("fa-bookmark")) {
      if (item.title && item.release_date) {
        route.push(`/movie-details/${item.id}`);
      } else if (item.name && item.first_air_date) {
        route.push(`/tv-details/${item.id}`);
      }
    }
  };

  const itemObj = {
    item: item,
    createdAt: timestamp(),
  };

  const itemId = item.id.toString();

  // conditionaly set sub collection path
  let subCollection = item.title ? "movies" : "tvs";

  // add/remove fave
  const toggleFaveIcon = async () => {
    if (subCollection && authCtx.authLogin.isLoggedIn) {
      const docRef = projectFirestore
        .collection("users")
        .doc(authCtx.userData.localId)
        .collection(subCollection)
        .doc(itemId);

      const doc = await docRef.get();

      if (doc.exists) {
        docRef.delete();
        setFaveIcon(false);
      } else {
        docRef.set(itemObj);
        setFaveIcon(true);
      }
    } else {
      authCtx.showAuthHandler();
    }
  };

  // check if doc is added to favorite
  const isFave = async () => {
    if (
      authCtx.authLogin.isLoggedIn &&
      authCtx.userData.localId &&
      subCollection
    ) {
      const docRef = projectFirestore
        .collection("users")
        .doc(authCtx.userData.localId)
        .collection(subCollection)
        .doc(itemId);

      const doc = await docRef.get();

      if (doc.exists) {
        setFaveIcon(true);
      } else {
        setFaveIcon(false);
      }
    } else {
      setFaveIcon(false);
    }
  };

  useEffect(() => {
    isFave();

    return () => {};
  }, [
    authCtx.authLogin.isLoggedIn && authCtx.userData.localId && subCollection,
  ]);

  return (
    <article onClick={handleCardClick} className="card card--home">
      <div className="card__img-container">
        {item.poster_path && (
          <img
            className="card__img"
            src={apiImgPath + item.poster_path}
            alt=""
            loading="lazy"
          />
        )}
        <button onClick={toggleFaveIcon}>
          <i
            className={`icon-fave fas fa-bookmark ${
              faveIcon ? "icon-active" : ""
            }`}
          ></i>
        </button>
      </div>
      <div className="card__info">
        {item.vote_average > 0 && (
          <>
            {item.vote_average >= 7 && (
              <div className="rating good">
                <div className="rating-bg">
                  <span>{item.vote_average}</span>
                </div>
              </div>
            )}

            {item.vote_average < 7 && item.vote_average > 4 && (
              <div className="rating mediocre">
                <div className="rating-bg">
                  <span>{item.vote_average}</span>
                </div>
              </div>
            )}

            {item.vote_average < 4 && item.vote_average > 0 && (
              <div className="rating bad">
                <div className="rating-bg">
                  <span>{item.vote_average}</span>
                </div>
              </div>
            )}
          </>
        )}

        {item.vote_average === 0 && (
          <div className="rating">
            <div className="rating-bg">
              <span className="no-rating">NR</span>
            </div>
          </div>
        )}
        {item.title && (
          <h3 className="card__title">{item.title.slice(0, 30)}</h3>
        )}
        {item.name && <h3 className="card__title">{item.name}</h3>}
        {item.release_date && <p className="card__date">{item.release_date}</p>}
        {item.first_air_date && (
          <p className="card__date">{item.first_air_date}</p>
        )}
      </div>
    </article>
  );
};

export default Card;
