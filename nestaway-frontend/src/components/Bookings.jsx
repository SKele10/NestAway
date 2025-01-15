import React, { useEffect, useState, useContext } from "react";
import { BookingURL, CreditsURL } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

import { useNavigate } from "react-router-dom";
export default function Bookings() {
  const navigateTo = useNavigate();
  const [error, setError] = useState();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [bookingsInfo, setBookingsInfo] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let headers = {};
        if (currentUser) {
          headers = {
            Authorization: `Bearer ${currentUser.accessToken}`,
          };
        }
        const bookingsResponse = await axios.get(
          BaseURL + BookingURL + "bookings",
          {
            headers,
          }
        );
        setBookingsInfo(bookingsResponse.data.data);
        setLoading(false);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
        </div>
        <button
          className={`text-accent1 rounded-lg ml-auto px-2 py-2 bg-primary hover:bg-action`}
          onClick={() => history.back()}
        >
          Go Back
        </button>
      </>
    );
  }

  if (error) {
    return (
      <>
        <p>{error}</p>
        <button
          className={`text-accent1 rounded-lg ml-auto px-2 py-2 bg-primary hover:bg-action`}
          onClick={() => history.back()}
        >
          Go Back
        </button>
      </>
    );
  }

  if (!currentUser) {
    return navigateTo("/");
  }
  if (bookingsInfo.length == 0) {
    return <p>You don't have any bookings</p>;
  }

  const handleStatusToggle = async (
    houseId,
    bookingId,
    status,
    totalPrice,
    userId
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
        status: status,
      },
      { headers }
    );
    totalPrice = Number(totalPrice);
    if (data.success && status === "approved") {
      const addCreditsResponse = await axios.post(
        BaseURL + CreditsURL + "add",
        { creditsToAdd: totalPrice },
        { headers }
      );
      if (addCreditsResponse) {
        const fetchData = async () => {
          const bookingsResponse = await axios.get(
            BaseURL + BookingURL + "bookings",
            { headers }
          );
          setBookingsInfo(bookingsResponse.data.data);
          setLoading(false);
        };
        await fetchData();
      }
    }
    if (data.success && status === "rejected") {
      const returnCreditsResponse = await axios.post(
        CreditsURL + "returnCredits",
        {
          userId: userId,
          creditsToAdd: totalPrice,
        },
        { headers }
      );
      if (returnCreditsResponse) {
        const fetchData = async () => {
          const bookingsResponse = await axios.get(
            BaseURL + BookingURL + "bookings",
            { headers }
          );
          setBookingsInfo(bookingsResponse.data.data);
          setLoading(false);
        };
        await fetchData();
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Booking List</h2>
      {bookingsInfo.map((booking) => (
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
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 mr-2 rounded"
              onClick={() =>
                handleStatusToggle(
                  booking.houseId,
                  booking.booking.bookingId,
                  "approved",
                  booking.booking.totalPrice.toFixed(2),
                  booking.booking.uid
                )
              }
            >
              Approve
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
              onClick={() =>
                handleStatusToggle(
                  booking.houseId,
                  booking.booking.bookingId,
                  "rejected",
                  booking.booking.totalPrice.toFixed(2),
                  booking.booking.uid
                )
              }
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
