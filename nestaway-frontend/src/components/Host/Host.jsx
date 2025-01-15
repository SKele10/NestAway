import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import { Carousel } from "react-responsive-carousel";
import { ButtonGroup } from "./ButtonGroup";
import ListingWizard from "./ListingWizard";
import { AuthContext } from "../../contexts/AuthContext";
import {
  initialAmenities,
  initialDetails,
  initialFeatures,
  initialPolicies,
  initialRules,
} from "../../constants";
import { GetHouseDetails, GetHousesByHost, HostURL } from "../../api";
import { Navigate } from "react-router-dom";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;
const Host = () => {
  const { currentUser } = useContext(AuthContext);
  const [wizardVisible, setWizardVisible] = useState(false);
  const [houseData, setHouseData] = useState([]);
  const [listingData, setListingData] = useState(null);
  const [houseDetails, setHouseDetails] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { toggleSearchVisible } = useContext(ThemeContext);

  const listingButtons = [
    { name: "allListings", label: "All Listings" },
    { name: "currentlyHosting", label: "Currently Hosting" },
    { name: "upcoming", label: "Upcoming" },
  ];

  const [activeButton, setActiveButton] = useState(listingButtons[0].name);

  const handleButtonClick = useCallback((buttonName) => {
    setActiveButton(buttonName);
  }, []);

  const handleAddListing = useCallback(() => {
    setWizardVisible(true);
    setIsUpdateMode(false);
  }, []);

  const handleUpdateListing = useCallback(
    (id) => {
      let headers = {};
      if (currentUser) {
        headers = {
          Authorization: `Bearer ${currentUser.accessToken}`,
        };
      }
      axios
        .get(BaseURL + GetHouseDetails + id, { headers })
        .then((response) => {
          setHouseDetails(response.data);
          setWizardVisible(true);
          setIsUpdateMode(true);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [currentUser]
  );

  const handleCloseWizard = useCallback(() => {
    let headers = {};
    if (currentUser) {
      headers = {
        Authorization: `Bearer ${currentUser.accessToken}`,
      };
    }
    setWizardVisible(false);
    setHouseDetails(null);
    axios
      .get(BaseURL + GetHousesByHost, { headers })
      .then((response) => {
        setHouseData(response.data);
        axios
          .get(BaseURL + HostURL, { headers })
          .then((response) => {
            setListingData(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUser]);

  useEffect(() => {
    let headers = {};
    if (currentUser) {
      headers = {
        Authorization: `Bearer ${currentUser.accessToken}`,
      };
    }
    toggleSearchVisible(false);
    axios
      .get(BaseURL + GetHousesByHost, { headers })
      .then((response) => {
        setHouseData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(BaseURL + HostURL, { headers })
      .then((response) => {
        setListingData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      toggleSearchVisible(true);
    };
  }, [currentUser, toggleSearchVisible]);

  if (!currentUser) {
    return <Navigate to="/" />;
  }
  return (
    <div
      className={`flex flex-col w-full h-screen px-20 py-4 font-didact gap-4 bg-accent1 text-accent2 ${
        wizardVisible ? "overflow-hidden" : "overflow-auto"
      }`}
    >
      <div className="flex w-full justify-between">
        <p className="text-xl">
          Welcome, <span className="font-bold">{currentUser?.displayName}</span>
        </p>
        <button
          className={`text-primary rounded-lg ml-auto p-2 border-2 border-primary  hover:bg-primary hover:text-accent1`}
          onClick={handleAddListing}
        >
          Add New Listing
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="">
          <span className="text-xl mx-2">Your Listings</span>
          <ButtonGroup
            buttons={listingButtons}
            selectedButton={activeButton}
            handleButtonClick={handleButtonClick}
          />
        </div>
        <div className="border-b border-accent2 w-full"></div>
        <div className="bg-secondary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
          {activeButton === "allListings" &&
            houseData.map((house) => (
              <div
                key={house._id}
                className="bg-accent1 shadow-shadow2 rounded-lg overflow-hidden hover:bg-secondary cursor-pointer w-60"
                onClick={() => handleUpdateListing(house._id)}
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

                  {house.isApproved && (
                    <div className="bg-info w-fit px-4 py-2 text-accent1 rounded-lg">
                      Approved
                    </div>
                  )}

                  {!house.isApproved && house.isDeleted && (
                    <div className="bg-error w-fit px-4 py-2 text-accent1 rounded-lg">
                      Rejected
                    </div>
                  )}
                  {!house.isApproved && !house.isDeleted && (
                    <div className="bg-warning w-fit px-4 py-2 text-accent1 rounded-lg">
                      Pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          {activeButton === "currentlyHosting" &&
            listingData.current.map((house) => {
              return house.bookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="bg-accent1 text-accent2 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="bg-primary  text-center py-2">
                    <div className="text-accent1">
                      Total Price: ${booking.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                    <div className=" mb-2">
                      Check-out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ));
            })}
          {activeButton === "upcoming" &&
            listingData.upcomingApproved.map((house) => {
              return house.bookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="bg-accent1 text-accent2 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="bg-primary  text-center py-2">
                    <div className="text-accent1">
                      Total Price: ${booking.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                    <div className=" mb-2">
                      Check-out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ));
            })}
          {activeButton === "pendingReview" &&
            listingData.pending.map((house) => {
              return house.bookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="bg-accent1 text-accent2 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="bg-primary  text-center py-2">
                    <div className="text-accent1">
                      Total Price: ${booking.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                    <div className=" mb-2">
                      Check-out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ));
            })}
        </div>
      </div>
      <ListingWizard
        active={wizardVisible}
        mode={isUpdateMode}
        onClose={handleCloseWizard}
        houseDetails={{
          _id: houseDetails ? houseDetails._id : null,
          houseType: houseDetails ? houseDetails.houseType : "",
          houseAddress: houseDetails ? houseDetails.address : "",
          photos: houseDetails
            ? houseDetails.photos
            : {
                main: "",
                images: [],
              },

          features: houseDetails ? houseDetails.features : initialFeatures,
          amenities: houseDetails ? houseDetails.amenities : initialAmenities,
          details: houseDetails
            ? {
                title: houseDetails.title,
                description: houseDetails.description,
                price: houseDetails.price,
              }
            : initialDetails,
          policies: houseDetails ? houseDetails.settings : initialPolicies,
          rules: houseDetails ? houseDetails.rules : initialRules,
        }}
      />
    </div>
  );
};

export default Host;
