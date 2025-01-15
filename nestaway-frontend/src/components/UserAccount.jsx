import React, { useCallback, useContext, useEffect, useState } from "react";
import SignOutButton from "./SignOut";
import ChangePassword from "./ChangePswd";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;
function UserAccount() {
  const { currentUser } = useContext(AuthContext);
  const [credits, setCredits] = useState(0);

  const handleAddCredits = useCallback(() => {
    let headers = {};
    if (currentUser) {
      headers = {
        Authorization: `Bearer ${currentUser.accessToken}`,
      };
    }
    axios
      .post(
        BaseURL + "/credits/add",
        {
          creditsToAdd: 1000,
        },
        { headers }
      )
      .then(() => {
        axios.get(BaseURL + "/credits", { headers }).then((response) => {
          setCredits(response.data);
        });
      });
  }, []);

  useEffect(() => {
    let headers = {};
    if (currentUser) {
      headers = {
        Authorization: `Bearer ${currentUser.accessToken}`,
      };
    }
    axios.get(BaseURL + "/credits", { headers }).then((response) => {
      setCredits(response.data);
    });
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex bg-secondary justify-center items-center h-[91.5vh]">
      <div className="bg-accent1 text-accent2 border border-primary shadow-lg p-8 w-96">
        <h2 className="text-2xl mb-4">Hello, {currentUser.displayName}</h2>
        <h2 className="text-xl mb-4">You have {credits} credits.</h2>
        <button
          className={`text-accent1 rounded-lg px-4 py-2 bg-primary hover:bg-action`}
          onClick={() => handleAddCredits()}
        >
          Add 1000 Credits
        </button>
        <ChangePassword />
        <SignOutButton />
      </div>
    </div>
  );
}

export default UserAccount;
