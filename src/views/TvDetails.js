import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMultiData from "../composables/useMultiData";
import CardDetails from "../components/CardDetails";
import CastCard from "../components/CastCard";
import ReviewForm from "../components/ReviewForm";
import CardReview from "../components/CardReview";
import Spinner from "../components/Spinner";
import useReviews from "../composables/useReviews";
import "../styles/MovieTvDetails.css";

const TvDetails = () => {
  const { itemId } = useParams();

  // api urls
  const apiTvDetails = `https://api.themoviedb.org/3/tv/${itemId}?api_key=9794e8bb02ba77223f102a1ab8f4e97d&language=en-US`;
  const apiTvCredits = `https://api.themoviedb.org/3/tv/${itemId}/credits?api_key=9794e8bb02ba77223f102a1ab8f4e97d&language=en-US`;
  const apiImgPath = "https://image.tmdb.org/t/p/original";

  // get data
  const { dataOne, dataTwo, getMultiData, isPending, error } = useMultiData();
  // get reviews data from firebase
  const { dataReviews, getReviews } = useReviews();

  // api urls array
  const urls = [apiTvDetails, apiTvCredits];

  useEffect(() => {
    getMultiData(urls);
    getReviews();
  }, []);

  return (
    <>
      <div className="movie-tv-details__data-container">
        <section className="movie-tv-details__card-details">
          {error && <p className="error">{error}</p>}
          {isPending && <Spinner />}
          {dataOne && <CardDetails item={dataOne} apiImgPath={apiImgPath} />}
        </section>

        <section className="movie-tv-details__cast-card">
          {error && <p className="error">{error}</p>}
          {dataTwo && (
            <>
              <h2 className="movie-tv-details__cast-list">Show cast</h2>
              <div className="movie-tv-details__cast">
                {dataTwo.cast.map((item) => (
                  <CastCard item={item} key={item.id} apiImg={apiImgPath} />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="movie-tv-details__reviews">
          <h2 className="movie-tv-details__list-title">Write a review</h2>
          <ReviewForm itemId={itemId} />

          {dataReviews && (
            <>
              <h2 className="movie-tv-details__list-title">Reviews</h2>
              <div className="movie-tv-details__users-reviews">
                {dataReviews.map((doc) => (
                  <CardReview item={doc} key={doc.userId} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default TvDetails;
