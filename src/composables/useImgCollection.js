import { useState } from "react";
import { projectFirestore } from "../firebase/firebase-init";

const useImgCollection = () => {
  const [imgData, setImgData] = useState(null);

  const getImgCollection = async (userId) => {
    const imgDataRef = await projectFirestore
      .collection("images")
      .doc(userId)
      .get();

    if (imgDataRef.exists) {
      setImgData(imgDataRef.data());
    } else {
      setImgData(null);
    }
  };

  return { imgData, getImgCollection };
};

export default useImgCollection;
