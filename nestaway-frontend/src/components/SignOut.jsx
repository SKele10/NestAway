import React from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";

const SignOutButton = () => {
  return (
    <button
      className="w-full bg-primary text-white py-2 rounded-lg focus:outline-none hover:bg-action mt-2"
      type="button"
      onClick={doSignOut}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
