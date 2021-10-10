import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({});

// calculate ramaining login time
const calcAuthTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjExpirationTime - currentTime;
  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const localId = localStorage.getItem("localId");
  const displayName = localStorage.getItem("displayName");
  const email = localStorage.getItem("email");

  const remainingTime = calcAuthTime(storedExpirationDate);

  // check & remove token/time if time expired
  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    localId: localId,
    displayName: displayName,
    email: email,
  };
};

export const AuthContextProvider = (props) => {
  // get access to data, that retrieveStoredToken() returns
  const tokenData = retrieveStoredToken();
  // init vars
  let initialToken;
  let initialLocalId;
  let initialDisplayName;
  let initialEmail;

  if (tokenData) {
    initialToken = tokenData.token;
    initialLocalId = tokenData.localId;
    initialDisplayName = tokenData.displayName;
    initialEmail = tokenData.email;
  }

  // state
  const [token, setToken] = useState(initialToken);
  const [localId, setLocalId] = useState(initialLocalId);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [email, setEmail] = useState(initialEmail);
  const [showAuth, setShowAuth] = useState(false);
  // auth message state
  const [showAuthMsg, setShowAuthMsg] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [authErrorMsg, setAuthErrorMsg] = useState("");

  const userIsLoggedIn = !!token; // checking if token is trufy

  const setUserData = {
    setLocalId: setLocalId,
    setDisplayName: setDisplayName,
    setEmail: setEmail,
  };

  // stored user data to have access in components
  const userData = {
    localId: localId,
    displayName: displayName,
    email: email,
  };

  // auth message
  const authMsgHandler = (value) => {
    setShowAuthMsg(true);
    setAuthMsg(value);

    setTimeout(() => {
      setShowAuthMsg(false);
    }, 2500);
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("localId");
    localStorage.removeItem("displayName");
    localStorage.removeItem("email");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    authMsgHandler("Logged out successfully!");
    setAuthErrorMsg("");
  }, []);

  const loginHandler = (token, expirationTime, localId, displayName, email) => {
    setLocalId(localId);
    setDisplayName(displayName);
    setEmail(email);
    setToken(token);
    setShowAuth(false);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    localStorage.setItem("localId", localId);
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("email", email);
    // log user out after time expires
    const remainingTime = calcAuthTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const authLogin = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  // show/close auth form
  const showAuthHandler = () => {
    setShowAuth(true);
  };

  const closeAuthHandler = () => {
    setShowAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        showAuth: showAuth,
        showAuthHandler: showAuthHandler,
        closeAuthHandler: closeAuthHandler,
        authLogin: authLogin,
        setUserData: setUserData,
        userData: userData,
        authMsgHandler: authMsgHandler,
        authMsg: authMsg,
        showAuthMsg: showAuthMsg,
        authErrorMsg: authErrorMsg,
        setAuthErrorMsg: setAuthErrorMsg,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
