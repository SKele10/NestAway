import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../contexts/AuthContext";
import SocialSignIn from "./SocialSignIn";
import ThemeContext from "../contexts/ThemeContext";
import { SendEmailURL } from "../api";

const BaseURL = import.meta.env.VITE_BASE_URL;
async function sendSignUpEmail(email, displayName) {
  const response = await fetch(BaseURL + SendEmailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, displayName }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send email");
  }
}

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const { toggleSearchVisible } = useContext(ThemeContext);
  const [pwMatch, setPwMatch] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
      await sendSignUpEmail(email.value, displayName.value);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    toggleSearchVisible(false);

    return () => {
      toggleSearchVisible(true);
    };
  }, [toggleSearchVisible]);

  if (currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center bg-secondary items-center h-[91.5vh]">
      <div className="border border-accent2 bg-accent1 text-accent2 shadow-lg rounded-lg p-8 w-96">
        <div className="bg-primary text-accent1 py-4 px-8 mb-4 rounded-t-lg">
          <h1 className="text-2xl">Sign up</h1>
        </div>
        {pwMatch && <h4 className="error">{pwMatch}</h4>}
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="displayName" className="block">
              Name:
            </label>
            <input
              className="w-full px-4 py-2 border bg-accent1 text-accent2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
              name="displayName"
              type="text"
              placeholder="Name"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="block">
              Email:
            </label>
            <input
              className="w-full px-4 py-2 border bg-accent1 text-accent2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordOne" className="block">
              Password:
            </label>
            <input
              className="w-full px-4 py-2 border bg-accent1 text-accent2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              id="passwordOne"
              name="passwordOne"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordTwo" className="block">
              Confirm Password:
            </label>
            <input
              className="w-full px-4 py-2 border bg-accent1 text-accent2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              name="passwordTwo"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg focus:outline-none hover:bg-action"
          >
            Sign Up
          </button>
        </form>
        <SocialSignIn />
      </div>
    </div>
  );
}

export default SignUp;
