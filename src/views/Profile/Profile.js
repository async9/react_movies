import { useContext, useEffect, useState } from "react";
import reactDom from "react-dom";
import AuthContext from "../../store/auth-context";
import Card from "../../components/Card/Card";
import Spinner from "../../components/Spinner/Spinner";
import ScrollBtn from "../../components/ScrollBtn/ScrollBtn";
import UploadForm from "../../components/UploadForm/UploadForm";
import useCollection from "../../composables/useCollection";
import useImgCollection from "../../composables/useImgCollection";
import DeleteProfile from "../../components/DeleteProfile/DeleteProfile";
import "../Profile/Profile.css";

const Profile = () => {
  const authCtx = useContext(AuthContext);
  const { getCollection, data, error, isPending } = useCollection();

  const { imgData, getImgCollection } = useImgCollection();

  const [showMovies, setShowMovies] = useState(true);
  const [showTvs, setShowTvs] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [addImg, setAddImg] = useState(false);

  const userToken = authCtx.authLogin.token;
  const userId = authCtx.userData.localId;

  const switchCollection = () => {
    if (showMovies) {
      getCollection("movies");
    }
    if (showTvs) {
      getCollection("tvs");
    }
  };

  useEffect(() => {
    switchCollection();
    window.scrollTo(0, 0);
  }, [showMovies, showTvs]);

  // toggle show movies/tv shows
  const handleDisplayMovies = () => {
    setShowMovies(true);
    setShowTvs(false);
  };

  const handleDisplayTvs = () => {
    setShowMovies(false);
    setShowTvs(true);
  };

  const showProfileModal = () => {
    setProfileModal(true);
  };

  const cancelDeleteUser = () => {
    setProfileModal(false);
  };

  const deleteUser = async () => {
    try {
      // delete user auth data
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDsSu3b5UqvCGiRWg4cVfpGJVBVH_RsHL8",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: userToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw Error("Failed to delete account. Please try again later");
      }
      // logout after account has been deleted
      authCtx.authLogin.logout();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddImg = () => {
    setAddImg(true);
  };

  const handleCancelAdd = () => {
    setAddImg(false);
  };

  useEffect(() => {
    getImgCollection(userId);
  }, []);

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__background"></div>
        <div className="profile__header-container">
          <div className="profile__img-container">
            {imgData && (
              <img
                src={imgData.url}
                className="profile__user-img"
                alt="user-img"
              />
            )}
            {!imgData && <div className="profile__user-img-default"></div>}
            <button
              onClick={handleAddImg}
              className="btn btn--add profile__add-btn"
            >
              <div className="btn--icon-container">
                <i className="add-icon fas fa-plus"></i>
              </div>
            </button>
          </div>
          <div className="profile__info">
            <h2 className="profile__name">{authCtx.userData.displayName}</h2>
            <h3 className="profile__email">{authCtx.userData.email}</h3>
            <button onClick={showProfileModal} className="profile__delete_user">
              Delete account
            </button>
          </div>
        </div>
      </header>

      <main className="profile__main">
        <div className="profile__main-header">
          <h2 className="profile__collections-title">
            Your favorited Movies and TV Shows in one place
          </h2>
          <div className="profile__btns-container">
            <button
              onClick={handleDisplayMovies}
              className={showMovies ? "btn" : "profile__btn-toggle"}
            >
              Movies
            </button>
            <button
              onClick={handleDisplayTvs}
              className={showTvs ? "btn" : "profile__btn-toggle"}
            >
              TV Shows
            </button>
          </div>
        </div>

        <section className="profile__collections">
          {isPending && <Spinner />}
          {error && <p className="error">{error}</p>}
          {data &&
            data.map((doc) => <Card item={doc.item} key={doc.item.id} />)}
        </section>
      </main>

      {profileModal &&
        reactDom.createPortal(
          <DeleteProfile
            deleteUser={deleteUser}
            cancelDeleteUser={cancelDeleteUser}
          />,
          document.getElementById("delete-modal")
        )}

      {reactDom.createPortal(
        <UploadForm
          userId={userId}
          addImg={addImg}
          handleCancelAdd={handleCancelAdd}
        />,
        document.getElementById("upload-modal")
      )}

      <ScrollBtn />
    </div>
  );
};

export default Profile;
