import { useContext, useState } from "react";
import MenuSvg from "../assets/MenuSvg";
import logo from "/logo.png";
import { Link, useLocation } from "react-router-dom";
import ThemeContext from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import UserAccount from "./UserAccount";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { pathname } = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const { theme, toggleTheme, searchVisible } = useContext(ThemeContext);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
    } else {
      setOpenNavigation(true);
    }
  };
  const { currentUser } = useContext(AuthContext);
  const NavigationAuth = () => {
    const [showUserAccount, setShowUserAccount] = useState(false);

    const toggleUserAccount = () => {
      setShowUserAccount(!showUserAccount);
    };

    return (
      <>
        <div className="flex gap-2">
          <Link
            className={`flex justify-center py-2 px-4 rounded-lg items-center text-accent1 font-didact transition-colors hover:bg-action ${
              pathname?.includes("bookings") ? "z-10 bg-action" : "bg-primary"
            } `}
            to="/bookings"
          >
            Pending Bookings
          </Link>
          <Link
            className={`flex justify-center py-2 px-4 rounded-lg items-center text-accent1 font-didact transition-colors hover:bg-action ${
              pathname?.includes("trips") ? "z-10 bg-action" : "bg-primary"
            } `}
            to="/trips"
          >
            Trips
          </Link>

          {!isAdmin && (
            <Link
              className={`flex justify-center py-2 px-4 rounded-lg items-center text-accent1 font-didact transition-colors hover:bg-action ${
                pathname?.includes("host") ? "z-10 bg-action" : "bg-primary"
              } `}
              to="/host"
            >
              Nest your Home
            </Link>
          )}
          {isAdmin && (
            <Link
              className={`flex justify-center py-2 px-4 rounded-lg items-center text-accent1 font-didact transition-colors hover:bg-action ${
                pathname?.includes("admin") ? "z-10 bg-action" : "bg-primary"
              } `}
              to="/admin"
            >
              Admin Dashboard
            </Link>
          )}

          <button
            className={`text-accent1 rounded-lg ml-auto px-2 py-2 bg-primary hover:bg-action`}
            onClick={toggleTheme}
          >
            Theme
          </button>
          <Link
            className={`flex justify-center py-2 px-4 rounded-lg items-center text-accent1 font-didact transition-colors hover:bg-action ${
              pathname?.includes("account") ? "z-10 bg-action" : "bg-primary"
            } `}
            to="/account"
          >
            Account
          </Link>
        </div>
        {showUserAccount && (
          <div className="absolute top-[4rem] right-0 w-[20rem] bg-white shadow-md rounded-md">
            <UserAccount />
          </div>
        )}
      </>
    );
  };

  const NavigationNonAuth = () => {
    return (
      <div className="flex gap-2">
        <div
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[4rem] z-20 right-0 w-48 bg-accent1 shadow-shadow1 rounded-lg mr-2`}
        >
          <div className="relative flex flex-col items-center justify-center w-full">
            <Link
              key="login"
              to="/login"
              className={`block relative font-didact text-accent2 transition-colors hover:bg-secondary px-6 py-2 w-full`}
            >
              Login
            </Link>
            <Link
              key="signup"
              to="/signup"
              className={`block relative font-didact text-accent2 transition-colors hover:bg-secondary px-6 py-2 w-full`}
            >
              Signup
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`text-accent1 rounded-lg ml-auto px-2 py-2 bg-primary hover:bg-action`}
            onClick={toggleTheme}
          >
            Theme
          </button>
          <button
            className={`bg-primary flex items-center gap-2 text-accent1 rounded-lg ml-auto px-2 py-2 hover:bg-action`}
            onClick={toggleNavigation}
          >
            {currentUser ? currentUser.displayName : ""}
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className={`static w-full shadow-shadow3 top-0 bg-accent1 z-50`}>
      <div className="flex items-center justify-between px-5 py-1">
        <Link
          className="  flex justify-center items-center font-comic font-bold w-[12rem] text-accent2 text-3xl hover:text-info"
          to="/"
        >
          <img
            className={theme === "light" ? "" : "invert"}
            src={logo}
            width={70}
            height={40}
            alt="Nestaway"
          />
          Nestaway
        </Link>
        {searchVisible && <SearchBar />}
        {currentUser ? <NavigationAuth /> : <NavigationNonAuth />}
      </div>
      <div className="border-b border-accent2 w-full"></div>
    </div>
  );
};

export default Navbar;
