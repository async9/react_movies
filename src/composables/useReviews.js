import { useState } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../firebase/firebase-init";

const useReviews = () => {
  const { itemId } = useParams();

  const [dataReviews, setDataReviews] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const [isPendingReviews, setIsPendingReviews] = useState(true);

  const getReviews = () => {
    const reviews = projectFirestore
      .collection("reviews")
      .doc(itemId)
      .collection("users-reviews")
      .orderBy("createdAt");

    reviews.onSnapshot(
      (snap) => {
        let docs = snap.docs.map((doc) => {
          return { ...doc.data() };
        });

        setDataReviews(docs);
        setErrorReviews(null);
        setIsPendingReviews(false);
      },
      (err) => {
        console.log(err.message);
        setDataReviews(null);
        setIsPendingReviews(false);
        setErrorReviews(
          "Could not fetch data, please referesh the page, or comeback later"
        );
      }
    );
  };

  return { getReviews, dataReviews, errorReviews, isPendingReviews };
};

export default useReviews;
