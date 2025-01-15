import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import api, { NewUserURL } from "../api";
import axios from "axios";

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  let user;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log(userCredential);
    user = userCredential.user;
    // console.log(user);
  } catch (error) {
    console.error("Error creating user:", error.message);
    return;
  }

  try {
    await updateProfile(auth.currentUser, { displayName });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return;
  }

  const BaseURL = import.meta.env.VITE_BASE_URL;
  try {
    await axios.post(BaseURL + NewUserURL, {
      name: displayName,
      email: user.email,
    });
    await doSignOut();
  } catch (error) {
    console.error("Error posting user data:", error.message);
  }
}
async function updateUserProfile(displayName) {
  const auth = getAuth();

  try {
    await updateProfile(auth.currentUser, { displayName });
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  let auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn() {
  let auth = getAuth();
  let socialProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, socialProvider);
      const user = auth.currentUser;
      return { email: user.email, displayName: user.displayName };
    } catch (error) {
      throw new Error('Error signing in with Google');
    }
}

async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
  window.location.href = "/";
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword,
  updateUserProfile,
};
