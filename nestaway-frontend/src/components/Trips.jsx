import React, { useEffect, useState, useContext } from "react";
import api, { TripURL, CreditsURL, BookingURL } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;
export default function Bookings() {
  const navigateTo = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [tripsInfo, setTripsInfo] = useState([]);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      let headers = {};
      if (currentUser) {
        headers = {
          Authorization: `Bearer ${currentUser.accessToken}`,
        };
      }
      try {
        const tripsResponse = await axios.get(BaseURL + TripURL, {
          headers,
        });
        //console.log(tripsResponse.data.data);
        setTripsInfo(tripsResponse.data.data);
        setLoading(false);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!currentUser) {
    return navigateTo("/");
  }
  if (tripsInfo.length == 0) {
    return <p>You don't have any trips</p>;
  }

  const handleStatusToggle = async (
    status,
    houseId,
    bookingId,
    totalPrice,
    userId,
    checkIn,
    settings,
    hostId
  ) => {
    let headers = {};
    if (currentUser) {
      headers = {
        Authorization: `Bearer ${currentUser.accessToken}`,
      };
    }
    const { data } = await axios.post(
      BaseURL + BookingURL + "toggleStatus",
      {
        houseId: houseId,
        bookingId: bookingId,
        status: "cancel",
      },
      { headers }
    );
    totalPrice = Number(totalPrice);
    const differenceInTime = new Date(checkIn).getTime() - new Date().getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const numberOfDays = Math.round(differenceInDays);
    if (data.success && numberOfDays > settings.cancellationDays) {
      const returnCreditsResponse = await axios.post(
        BaseURL + CreditsURL + "returnCredits",
        {
          userId: userId,
          creditsToAdd: totalPrice,
        },
        { headers }
      );
      if (returnCreditsResponse) {
        const fetchData = async () => {
          const tripsResponse = await axios.get(BaseURL + TripURL, { headers });
          setTripsInfo(tripsResponse.data.data);
          setLoading(false);
        };
        await fetchData();
      }
    } else if (data.success && numberOfDays < settings.cancellationDays) {
      const returnCreditsToUser =
        totalPrice * (settings.cancellationPercent / 100);
      const returnCreditsResponse = await axios.post(
        BaseURL + CreditsURL + "returnCredits",
        {
          userId: userId,
          creditsToAdd: returnCreditsToUser,
        },
        { headers }
      );
      const deductCreditsResponse = await axios.post(
        BaseURL + CreditsURL + "deductByUserId",
        {
          userId: hostId,
          creditsToAdd: returnCreditsToUser,
        },
        { headers }
      );
      if (deductCreditsResponse && returnCreditsResponse) {
        const fetchData = async () => {
          const tripsResponse = await axios.get(BaseURL + TripURL, { headers });
          setTripsInfo(tripsResponse.data.data);
          setLoading(false);
        };
        await fetchData();
      }
    }
    if (status === "change") {
      navigateTo(`/house/${houseId}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Trip List</h2>
      {tripsInfo.map((booking) => (
        <div
          key={booking.booking.bookingId}
          className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
        >
          <div className="p-4">
            <p className="text-gray-800 text-lg font-semibold mb-2">
              Booking Number: {booking.booking.bookingId}
            </p>
            {/* <p className="text-gray-600"><strong>User ID:</strong> {booking.uid}</p> */}
            <p className="text-gray-600">
              <strong>Check-In:</strong>{" "}
              {new Date(booking.booking.checkIn).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>Check-Out:</strong>{" "}
              {new Date(booking.booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>Total Price:</strong> $
              {booking.booking.totalPrice.toFixed(2)}
            </p>
            {/* <p className="text-gray-600"><strong>Status:</strong> {booking.status}</p> */}
          </div>
          <div className="bg-gray-100 p-4 flex justify-end">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
              onClick={() =>
                handleStatusToggle(
                  "cancel",
                  booking.houseId,
                  booking.booking.bookingId,
                  booking.booking.totalPrice.toFixed(2),
                  booking.booking.uid,
                  booking.booking.checkIn,
                  booking.settings,
                  booking.hostId
                )
              }
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
