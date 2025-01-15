import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setCurrentUserAsync } from "../store/authSlice";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const auth = getAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    const myListener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      dispatch(setCurrentUserAsync(user));
      setLoadingUser(false);
    });

    return () => {
      if (myListener) myListener();
    };
  }, [dispatch, auth]);

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
