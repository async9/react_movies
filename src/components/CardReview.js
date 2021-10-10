import { useEffect } from "react";
import useImgCollection from "../composables/useImgCollection";
import "../styles/CardReview.css";

const CardReview = ({ item }) => {
  const { imgData, getImgCollection } = useImgCollection();

  useEffect(() => {
    getImgCollection(item.userId);
  }, []);

  return (
    <article className="card-review">
      <div className="card-review__header">
        {imgData && (
          <img src={imgData.url} className="card-review__img" alt="user-img" />
        )}
        {!imgData && <div className="card-review__img-default"></div>}
        <div className="card-review__user-info">
          <div>
            <h3 className="card-review__username">{item.userName}</h3>
            {item.createdAt && (
              <small className="card-review__posted-at">
                {item.createdAt.toDate().toDateString()}
              </small>
            )}
          </div>
        </div>
      </div>

      <h3 className="card-review__review-title">{item.reviewTitle}</h3>
      <p className="card-review__review-text">{item.reviewBody}</p>
    </article>
  );
};

export default CardReview;
