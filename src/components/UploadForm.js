import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import useStorage from "../composables/useStorage";
import "../styles/UploadForm.css";

const UploadForm = ({ addImg, handleCancelAdd }) => {
  const [fileImg, setFileImg] = useState(null);
  const [fileImgError, setFileImgError] = useState(false);

  // use firebase storage
  const { fileUrl, fileError, progress, getStorage } = useStorage();

  // allowed file types
  const fileTypes = ["image/png", "image/jpeg"];

  // upload img file
  const handleAddChange = (e) => {
    let selected = e.target.files[0];

    if (selected && fileTypes.includes(selected.type)) {
      setFileImg(selected);
      setFileImgError("");
    } else {
      setFileImg(null);
      setFileImgError("Please select an image file (png or jpeg)");
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    getStorage(fileImg);
  };

  return (
    <>
      {addImg && (
        <div className="backdrop">
          <form className="upload-form">
            <input
              className="upload-form__input"
              type="file"
              onChange={handleAddChange}
            />
            <div>
              {fileImg && (
                <ProgressBar
                  fileImg={fileImg}
                  fileUrl={fileUrl}
                  progress={progress}
                  setFileImg={setFileImg}
                />
              )}
              {fileImgError && (
                <p className="upload-form__error">{fileImgError}</p>
              )}
              {fileError && <p className="upload-form__error">{fileError}</p>}
              {fileUrl && (
                <p className="upload-form__text">
                  Refresh the page to aply changes
                </p>
              )}
            </div>

            <div className="upload-form__btns">
              {!fileImgError && (
                <button onClick={handleFileUpload} className="btn">
                  Upload
                </button>
              )}
              {fileImgError && (
                <button className="btn" disabled>
                  Upload
                </button>
              )}
              <button onClick={handleCancelAdd} className="btn btn--cancel">
                Exit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UploadForm;
