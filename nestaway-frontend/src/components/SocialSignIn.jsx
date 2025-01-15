import { GoogleLogo } from "@phosphor-icons/react";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";
import { checkIfAdminAsync } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { SendEmailURL } from "../api";

const BaseURL = import.meta.env.VITE_BASE_URL;
const SocialSignIn = () => {
  const dispatch = useDispatch();
  const socialSignOn = async () => {
    try {
      const userData = await doSocialSignIn();
      await sendSignUpEmail(userData.email, userData.displayName);
      dispatch(checkIfAdminAsync());
    } catch (error) {
      alert(error);
    }
  };
  const sendSignUpEmail = async (email, displayName) => {
    try {
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
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center font-didact text-primary bg-accent1 mt-2">
      <button
        onClick={() => socialSignOn()}
        className="flex items-center gap-2 px-4 py-2  border border-primary rounded-lg shadow-md  hover:bg-action hover:text-accent1 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <GoogleLogo size={32} />
        <span className="font-medium">Sign in with Google</span>
      </button>
    </div>
  );
};

export default SocialSignIn;
