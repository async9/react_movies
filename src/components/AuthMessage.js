import { useContext } from "react";
import AuthContext from "../store/auth-context";
import "../styles/AuthMessage.css";

const AuthMessage = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div
      className={`auth-msg ${authCtx.showAuthMsg ? "auth-msg--active" : ""}`}
    >
      {authCtx.authMsg && !authCtx.authErrorMsg && (
        <div className="auth-msg__container auth-msg__success">
          <p className="auth-msg__text">{authCtx.authMsg}</p>
        </div>
      )}

      {authCtx.authErrorMsg && (
        <div className="auth-msg__container auth-msg__error">
          <h2 className="auth-msg__text">{authCtx.authMsg}</h2>
        </div>
      )}
    </div>
  );
};

export default AuthMessage;
