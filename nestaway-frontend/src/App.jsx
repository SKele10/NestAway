import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PaymentGateway from "./components/PaymentGateway";
import { ThemeProvider } from "./contexts/ThemeContext";
import Host from "./components/Host/Host";
import "primeicons/primeicons.css";
import { AuthContext } from "./contexts/AuthContext";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import UserAccount from "./components/UserAccount";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useContext } from "react";
import ListingDetail from "./components/ListingDetail";
import PaymentSuccessful from "./components/PaymentSuccessful";
import Admin from "./components/Admin";
import Bookings from "./components/Bookings";
import Trips from "./components/Trips";
import NotFound from "./components/NotFound";
import { useSelector } from "react-redux";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const auth = useSelector((state) => state.auth);
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {currentUser && (
              <>
                <Route path="/host" element={<Host />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/payment" element={<PaymentGateway />} />
                {auth && auth?.isAdmin && (
                  <Route path="/admin" element={<Admin />} />
                )}
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/trips" element={<Trips />} />
              </>
            )}

            <Route path="/house/:id" element={<ListingDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
