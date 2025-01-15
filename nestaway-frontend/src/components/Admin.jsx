import React, { useCallback, useContext, useEffect, useState } from "react";
import { ApproveHouse, GetAllPending, RejectHouse } from "../api";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { useSelector } from "react-redux";
import { AuthContext } from "../contexts/AuthContext";

const BaseURL = import.meta.env.VITE_BASE_URL;

const Admin = () => {
  const [houseData, setHouseData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    try {
      let headers = {};
      if (currentUser) {
        headers = {
          Authorization: `Bearer ${currentUser.accessToken}`,
        };
      }

      const response = await axios.get(BaseURL + GetAllPending, { headers });
      if (response.data.isAdmin) {
        setIsAdmin(true);
        setHouseData(response.data.houses);
      } else {
        setIsAdmin(false);
        setHouseData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currentUser]);

  const handleApprove = useCallback(
    (houseId) => {
      let headers = {};
      if (currentUser) {
        headers = {
          Authorization: `Bearer ${currentUser.accessToken}`,
        };
      }
      axios
        .get(BaseURL + ApproveHouse + houseId, { headers })
        .then((response) => {
          fetchData();
        });
    },
    [currentUser, fetchData]
  );
  const handleReject = useCallback(
    (houseId) => {
      let headers = {};
      if (currentUser) {
        headers = {
          Authorization: `Bearer ${currentUser.accessToken}`,
        };
      }
      axios
        .get(BaseURL + RejectHouse + houseId, { headers })
        .then((response) => {
          fetchData();
        });
    },
    [currentUser, fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="h-[91.5vh] bg-secondary overflow-y-auto">
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 ">
        {houseData &&
          houseData.map((house) => (
            <div
              key={house._id}
              className="h-full bg-accent1 shadow-shadow2 rounded-lg overflow-hidden cursor-pointer w-60"
            >
              <Carousel
                showThumbs={false}
                showIndicators={true}
                showStatus={false}
                infiniteLoop={true}
                autoPlay={true}
                interval={5000}
                className="max-w-screen-lg"
              >
                {house.photos &&
                  house.photos.images &&
                  house.photos.images.map((photo, index) => (
                    <img
                      key={house._id + index}
                      src={photo}
                      alt={house.title}
                      className="w-full h-40 object-cover object-center"
                    />
                  ))}
              </Carousel>
              <div className="p-4 text-accent2">
                <h3 className="text-lg font-semibold mb-2">{house.title}</h3>
                <p className="text-accent2 mb-2">
                  Price per night: ${house.price}
                </p>
                <p className="text-accent2 mb-2">
                  Location: {house.address.address_line1}
                </p>
              </div>
              <div className="flex justify-around items-center mb-2">
                <button
                  className={`text-accent1 rounded-lg px-4 py-2 bg-primary hover:bg-action`}
                  onClick={() => handleApprove(house._id)}
                >
                  Approve
                </button>
                <button
                  className={`text-accent1 rounded-lg px-4 py-2 bg-error hover:bg-action`}
                  onClick={() => handleReject(house._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Admin;
