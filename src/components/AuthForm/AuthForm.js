import { useContext, useState } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth-context";
import Spinner from "../Spinner/Spinner";
import "../AuthForm/AuthForm.css";

const AuthForm = () => {
  const authCtx = useContext(AuthContext);
  const route = useHistory();

  // state
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // input values state
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  // input blur state
  const [enteredNameBlur, setEnteredNameBlur] = useState(false);
  const [enteredEmailBlur, setEnteredEmailBlur] = useState(false);
  const [enteredPasswordBlur, setEnteredPasswordBlur] = useState(false);

  const validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

  // validation vars
  const nameIsValid = enteredName.trim() !== "" && enteredName.length >= 3;
  const emailIsValid =
    enteredEmail.trim() !== "" && enteredEmail.match(validRegex);
  const passwordIsValid =
    enteredPassword.trim() !== "" && enteredPassword.length >= 6;
  // invalid vars
  const nameInvalid = !nameIsValid && enteredNameBlur;
  const emailInvalid = !emailIsValid && enteredEmailBlur;
  const passwordInvalid = !passwordIsValid && enteredPasswordBlur;

  // get input values on change
  const inputNameHandler = (e) => {
    setEnteredName(e.target.value);
  };
  const inputEmailHandler = (e) => {
    setEnteredEmail(e.target.value);
  };
  const inputPasswordHandler = (e) => {
    setEnteredPassword(e.target.value);
  };

  //set input blur state
  const nameBlurHandler = (e) => {
    setEnteredNameBlur(true);
  };
  const emailBlurHandler = (e) => {
    setEnteredEmailBlur(true);
  };
  const passwordBlurHandler = (e) => {
    setEnteredPasswordBlur(true);
  };

  // switch login/signin form inputs
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // checking form validity
    if (nameInvalid && emailInvalid && passwordInvalid) {
      // reset password input field value
      setEnteredPassword("");
      // reset input fields blur
      setEnteredNameBlur(false);
      setEnteredEmailBlur(false);
      setEnteredPasswordBlur(false);
      return;
    }

    setEnteredNameBlur(true);
    setEnteredEmailBlur(true);
    setEnteredPasswordBlur(true);

    setIsLoading(true);
    let url;

    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDsSu3b5UqvCGiRWg4cVfpGJVBVH_RsHL8";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDsSu3b5UqvCGiRWg4cVfpGJVBVH_RsHL8";
    }

    // fetch data
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          displayName: !isLogin ? enteredName : "",
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw Error(
          "Authentication failed! Please check if your email and password is correct"
        );
      }

      const data = await response.json();
      setIsLoading(false);

      authCtx.authMsgHandler("Logged in successfully!"); // auth message
      authCtx.setAuthErrorMsg("");

      // get token expiration time in miliseconds
      const expirationTime = new Date(
        new Date().getTime() + +data.expiresIn * 1000
      );
      // send input value to auth context
      authCtx.authLogin.login(
        data.idToken,
        expirationTime.toISOString(),
        data.localId,
        data.displayName,
        data.email
      );

      if (!isLogin) {
        authCtx.authMsgHandler("Signed up successfully!"); // auth message
        authCtx.setAuthErrorMsg("");
        route.push(`/profile/${data.localId}`);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      authCtx.setAuthErrorMsg(err.message);
      authCtx.authMsgHandler(err.message);
    }
  };

  return (
    <div className="backdrop">
      <form onSubmit={submitHandler} className="auth">
        <button
          onClick={authCtx.closeAuthHandler}
          type="button"
          className="auth__exit-btn"
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="auth__title">{isLogin ? "Login" : "Sign up"}</h2>

        {!isLogin && (
          <>
            <input
              onChange={inputNameHandler}
              onBlur={nameBlurHandler}
              value={enteredName}
              className={`auth__input ${
                nameInvalid ? "auth__input--error" : "auth__input"
              }`}
              type="text"
              placeholder="Username..."
            />
            {nameInvalid && (
              <div className="auth__error-msg-container">
                <i className="fas fa-exclamation-triangle icon-error"></i>
                <p className="auth__text-error">
                  username must be at least 3 characters long
                </p>
              </div>
            )}
          </>
        )}

        <input
          onChange={inputEmailHandler}
          onBlur={emailBlurHandler}
          value={enteredEmail}
          className={`auth__input ${
            emailInvalid ? "auth__input--error" : "auth__input"
          }`}
          type="email"
          placeholder="Email..."
        />
        {emailInvalid && (
          <div className="auth__error-msg-container">
            <i className="fas fa-exclamation-triangle icon-error"></i>
            <p className="auth__text-error">
              incorrect email: email@example.com
            </p>
          </div>
        )}

        <input
          onChange={inputPasswordHandler}
          onBlur={passwordBlurHandler}
          value={enteredPassword}
          className={`auth__input ${
            passwordInvalid ? "auth__input--error" : "auth__input"
          }`}
          type="password"
          placeholder="Password..."
        />
        {passwordInvalid && (
          <div className="auth__error-msg-container">
            <i className="fas fa-exclamation-triangle icon-error"></i>
            <p className="auth__text-error">
              password must be at least 6 characters long
            </p>
          </div>
        )}

        <div className="auth__btns-container">
          {!isLoading && (
            <button className="btn">
              {isLogin ? "Log in" : "Create account"}
            </button>
          )}
          {isLoading && <Spinner />}
        </div>

        <button
          onClick={switchAuthModeHandler}
          type="button"
          className="auth__btn-toggle"
        >
          {isLogin && (
            <p>
              Or create <span className="auth__span-text">new account</span>
            </p>
          )}

          {!isLogin && (
            <p>
              <span className="auth__span-text">Login</span> into existing
              account
            </p>
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
