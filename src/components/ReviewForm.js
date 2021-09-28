import { useContext, useRef } from "react";
import AuthContext from "../store/auth-context";
import { projectFirestore, timestamp } from "../firebase/firebase-init";
import "../styles/ReviewForm.css";

const ReviewForm = ({ itemId }) => {
  const authCtx = useContext(AuthContext);
  const enteredReviewTitle = useRef();
  const enteredReviewBody = useRef();

  const addReview = async () => {
    const userId = authCtx.userData.localId;
    const userName = authCtx.userData.displayName;
    const titleReview = enteredReviewTitle.current.value;
    const bodyReview = enteredReviewBody.current.value;

    // submit object
    let reviewObj = {
      userId: userId,
      userName: userName,
      reviewTitle: titleReview,
      reviewBody: bodyReview,
      createdAt: timestamp(),
    };

    if (authCtx.authLogin.isLoggedIn && titleReview && bodyReview) {
      await projectFirestore
        .collection("reviews")
        .doc(itemId)
        .collection("users-reviews")
        .doc(userId)
        .set(reviewObj);
    } else {
      authCtx.showAuthHandler();
    }
    // reset inputs
    enteredReviewTitle.current.value = "";
    enteredReviewBody.current.value = "";
  };

  const cancelReview = () => {
    enteredReviewTitle.current.value = "";
    enteredReviewBody.current.value = "";
  };

  return (
    <form className="review-form">
      <input
        ref={enteredReviewTitle}
        className="review-form__input"
        placeholder="Review title..."
        maxLength="50"
        required
      />
      <textarea
        ref={enteredReviewBody}
        className="review-form__text-area"
        placeholder="Detailed review..."
        maxLength="2500"
        required
      ></textarea>
      <div className="review-form__btns-container">
        <button onClick={addReview} className="btn">
          Submit review
        </button>
        <button onClick={cancelReview} className="btn btn--cancel">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
