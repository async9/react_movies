import "../styles/DeleteProfile.css";

const DeleteProfile = ({ deleteUser, cancelDeleteUser }) => {
  return (
    <div className="backdrop">
      <div className="delete-profile">
        <i className="fas fa-exclamation-triangle delete-profile__icon-danger"></i>
        <h3 className="delete-profile__title">Are you sure?</h3>
        <p className="delete-profile__text">
          Do you really want to delete your account and all your favorited
          movies and tv shows?
        </p>
        <div className="delete-profile__btns">
          <button onClick={deleteUser} className="btn btn--delete">
            Delete
          </button>
          <button onClick={cancelDeleteUser} className="btn btn--cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
