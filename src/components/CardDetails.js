import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/auth-context";
import { projectFirestore } from "../firebase/firebase-init";
import "../styles/CardDetails.css";

const CardDetails = ({ item, apiImgPath }) => {
  const authCtx = useContext(AuthContext);

  const [faveIcon, setFaveIcon] = useState(false);

  const itemObj = {
    item: item,
  };

  const itemId = item.id.toString();

  // conditionaly set sub collection path
  let subCollection = item.title ? "movies" : "tvs";

  const toggleFaveIcon = async () => {
    if (subCollection && authCtx.authLogin.isLoggedIn) {
      const docRef = await projectFirestore
        .collection("users")
        .doc(authCtx.userData.localId)
        .collection(subCollection)
        .doc(itemId);

      docRef.get().then((doc) => {
        if (doc.exists) {
          docRef.delete();
          setFaveIcon(false);
        } else {
          docRef.set(itemObj);
          setFaveIcon(true);
        }
      });
    } else {
      authCtx.showAuthHandler();
    }
  };

  // check if doc is added to favorite
  const isFave = () => {
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

      docRef.get().then((doc) => {
        if (doc.exists) {
          setFaveIcon(true);
        } else {
          setFaveIcon(false);
        }
      });
    } else {
      setFaveIcon(false);
    }
  };

  useEffect(() => {
    isFave();

    return () => {};
  }, [authCtx.authLogin.isLoggedIn, authCtx.userData.localId, subCollection]);

  // format numbers to currency
  const formatDollar = (num) => {
    let p = num.toFixed(1).split(".");
    return (
      "$" +
      p[0]
        .split("")
        .reverse()
        .reduce((acc, num, i, orig) => {
          return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, "") +
      "." +
      p[1]
    );
  };

  let revenue;
  let budget;

  if (item.revenue && item.budget) {
    revenue = formatDollar(item.revenue);
    budget = formatDollar(item.budget);
  }

  return (
    <div className="card-details">
      {item && (
        <img
          src={apiImgPath + item.poster_path}
          className="card-details__background"
          alt=""
        />
      )}
      {item && (
        <div className="card-details__container">
          <div className="card-details__sub-container">
            {item.poster_path && (
              <img
                src={apiImgPath + item.poster_path}
                className="card-details__img"
                alt=""
              />
            )}

            <div className="card-details__info">
              {item.title && (
                <h2 className="card-details__title">{item.title}</h2>
              )}
              {item.name && (
                <h2 className="card-details__title">{item.name}</h2>
              )}
              <div className="card-details__date-genre">
                {item.release_date && (
                  <p className="card-details__date">{item.release_date}</p>
                )}
                {item.first_air_date && (
                  <p className="card-details__date">{item.first_air_date}</p>
                )}
                <div className="card-details__dot"></div>
                <div className="card-details__genre-container">
                  {item.genres.map((item, index) => (
                    <p key={item.id} className="card-details__genres">
                      {index > 0 && ", "}
                      {item.name}
                    </p>
                  ))}
                </div>
                <div className="card-details__dot"></div>
                {item.runtime && (
                  <p className="card-details__runtime">{item.runtime} min</p>
                )}
                {item.episode_run_time && (
                  <p className="card-details__runtime">
                    {item.episode_run_time} min episode
                  </p>
                )}
              </div>

              <div className="card-details__rating-fave">
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
                      <span>NR</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={toggleFaveIcon}
                  className={
                    faveIcon
                      ? "card-details__icon-fave-container--active"
                      : "card-details__icon-fave-container"
                  }
                >
                  <div className="card-details__icon-fave-bg">
                    <i
                      className={`icon-fave fas fa-bookmark ${
                        faveIcon ? "icon-active" : ""
                      }`}
                    ></i>
                  </div>
                </button>
              </div>

              <h3 className="card-details__tagline">{item.tagline}</h3>
              <h3 className="card-details__overview-title">Overview</h3>
              <p className="card-details__overview">{item.overview}</p>

              <div className="card-details__aditional-info">
                {item.budget && (
                  <p className="card-details__text">
                    Budget:{" "}
                    <span className="card-details__text-light">{budget}</span>
                  </p>
                )}
                {item.revenue && (
                  <p className="card-details__text">
                    Revenue:{" "}
                    <span className="card-details__text-light">{revenue}</span>
                  </p>
                )}

                {item.number_of_episodes && (
                  <p className="card-details__text">
                    {" "}
                    Episodes: {""}
                    {item.number_of_episodes}
                  </p>
                )}
                {item.number_of_seasons && (
                  <p className="card-details__text">
                    {" "}
                    Seasons: {""}
                    {item.number_of_seasons}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDetails;
