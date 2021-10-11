import { useContext, useState } from "react";
import AuthContext from "../store/auth-context";
import { projectFirestore } from "../firebase/firebase-init";

const useCollection = () => {
  const authCtx = useContext(AuthContext);
  const userId = authCtx.userData.localId;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  const getCollection = (collection) => {
    const userIdRef = projectFirestore.collection("users").doc(userId);

    userIdRef
      .collection(collection)
      .orderBy("createdAt")
      .onSnapshot(
        (snap) => {
          let docs = snap.docs.map((doc) => {
            return { ...doc.data() };
          });

          setData(docs);
          setError(null);
          setIsPending(false);
        },
        (err) => {
          console.log(err.message);
          setData(null);
          setIsPending(false);
          setError(
            "Could not fetch data, please referesh the page, or comeback later"
          );
        }
      );
  };

  return { getCollection, data, error, isPending };
};

export default useCollection;
