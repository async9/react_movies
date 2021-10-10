import { useEffect } from "react";
import "../styles/ProgressBar.css";

const ProgressBar = ({ fileUrl, setFileImg, progress }) => {
  useEffect(() => {
    if (fileUrl) {
      setFileImg(null);
    }
  }, [fileUrl, setFileImg]);

  return (
    <>
      <div className="progress-bar" style={{ width: progress + "%" }}></div>
    </>
  );
};

export default ProgressBar;
