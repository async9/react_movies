import { useState } from "react";
import { projectFirestore } from "../firebase/firebase-init";

const useImgCollection = () => {
  const [imgData, setImgData] = useState(null);

  const getImgCollection = async (userId) => {
    const imgDataRef = projectFirestore.collection("images").doc(userId);

    await imgDataRef.get().then((doc) => {
      if (doc.exists) {
        setImgData(doc.data());
      } else {
        setImgData(null);
      }
    });
  };

  return { imgData, getImgCollection };
};

export default useImgCollection;
