import { useContext, useEffect } from "react";
import SocialSignIn from "./SocialSignIn";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";
import ThemeContext from "../contexts/ThemeContext";
import { checkIfAdminAsync } from "../store/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const { currentUser } = useContext(AuthContext);
  const { toggleSearchVisible } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
      dispatch(checkIfAdminAsync());
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link"
      );
    }
  };

  useEffect(() => {
    toggleSearchVisible(false);

    return () => {
      toggleSearchVisible(true);
    };
  }, [toggleSearchVisible]);

  if (currentUser) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex justify-center bg-secondary items-center h-[91.5vh]">
      <div className="border border-accent2 bg-accent1 text-accent2 shadow-lg rounded-lg p-8 w-96">
        <div className="bg-primary text-accent1 py-4 px-8 mb-4 rounded-t-lg">
          <h1 className="text-2xl">Log-In</h1>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="block">
              Email Address:
            </label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              required
              autoFocus
              className="w-full px-4 py-2 border bg-accent1 text-accent2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block">
              Password:
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
              className="w-full px-4 py-2 border bg-accent1 text-accent2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg focus:outline-none hover:bg-action"
          >
            Log in
          </button>
          <button
            type="button"
            className="w-full text-primary text-sm font-medium focus:outline-none hover:underline"
            onClick={passwordReset}
          >
            Forgot Password
          </button>
        </form>

        {/* You can include SocialSignIn component here if needed */}
        <SocialSignIn />
      </div>
    </div>
  );
}

export default Login;
