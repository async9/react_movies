import { useContext, useState } from "react";
import AuthContext from "../store/auth-context";
import { projectStorage, projectFirestore } from "../firebase/firebase-init";

const useStorage = () => {
  const authCtx = useContext(AuthContext);
  const userId = authCtx.userData.localId;

  const [fileUrl, setFileUrl] = useState("");
  const [fileError, setFileError] = useState(null);
  const [progress, setProgress] = useState(0);

  const getStorage = (file) => {
    // firestore file path
    const collectionRef = projectFirestore.collection("images").doc(userId);

    // upload file to storage
    const storageRef = projectStorage
      .ref(`images/${userId}/${file.name}`)
      .put(file);

    storageRef.on(
      "state_changed",
      (snap) => {
        // calcualte upload progress
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (error) => {
        console.log(error);
        setFileError(error);
      },
      async () => {
        const url = await projectStorage
          .ref("images")
          .child(userId)
          .child(file.name)
          .getDownloadURL();

        collectionRef.set({ url: url }); // set file url to firestore
        setFileUrl(url);
      }
    );
  };

  return { fileUrl, fileError, progress, getStorage };
};

export default useStorage;
