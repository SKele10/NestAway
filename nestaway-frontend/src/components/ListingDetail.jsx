import { useContext, useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { GetHouseDetails, HostURL } from "../api";
import ThemeContext from "../contexts/ThemeContext";
import { Rating } from "primereact/rating";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import {
  Barbell,
  Bathtub,
  BellSimple,
  CalendarDot,
  Cigarette,
  Clock,
  ClockAfternoon,
  CookingPot,
  Fire,
  FireExtinguisher,
  FirstAidKit,
  HairDryer,
  LetterCircleP,
  Monitor,
  PawPrint,
  Percent,
  Siren,
  Sun,
  SwimmingPool,
  Thermometer,
  WashingMachine,
  WifiHigh,
  Wind,
} from "@phosphor-icons/react";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

const icons = {
  wifi: <WifiHigh className="text-primary text-2xl" />,
  tv: <Monitor className="text-primary text-2xl" />,
  ac: <Wind className="text-primary text-2xl" />,
  kitchen: <CookingPot className="text-primary text-2xl" />,
  parking: <LetterCircleP className="text-primary text-2xl" />,
  pool: <SwimmingPool className="text-primary text-2xl" />,
  gym: <Barbell className="text-primary text-2xl" />,
  hotTub: <Bathtub className="text-primary text-2xl" />,
  fireplace: <Fire className="text-primary text-2xl" />,
  washer: <WashingMachine className="text-primary text-2xl" />,
  dryer: <HairDryer className="text-primary text-2xl" />,
  heating: <Thermometer className="text-primary text-2xl" />,
  smokeDetector: <Siren className="text-primary text-2xl" />,
  carbonMonoxideDetector: <BellSimple className="text-primary text-2xl" />,
  firstAidKit: <FirstAidKit className="text-primary text-2xl" />,
  fireExtinguisher: <FireExtinguisher className="text-primary text-2xl" />,
};

const ListingDetail = () => {
  const navigateTo = useNavigate();
  const { id } = useParams();
  const { toggleSearchVisible } = useContext(ThemeContext);
  const [houseDetails, setHouseDetails] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    houseid: id,
    checkIn: "",
    checkOut: "",
  });

  const isFormValid = () => {
    return (
      bookingForm.houseid.trim() !== "" &&
      bookingForm.checkIn !== "" &&
      bookingForm.checkOut !== ""
    );
  };

  useEffect(() => {
    axios
      .get(BaseURL + GetHouseDetails + id)
      .then((response) => {
        setHouseDetails(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    toggleSearchVisible(false);

    return () => {
      toggleSearchVisible(true);
    };
  }, [toggleSearchVisible]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    return navigateTo("/payment", { state: { bookingForm } });
  };
  if (!houseDetails) {
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

  const { houseType, address, features, amenities, rules, settings } =
    houseDetails;

  return (
    <div className="flex flex-col text-accent2 bg-accent1 overflow-y-auto py-6 px-24 font-didact">
      <h1 className="text-2xl font-extrabold py-6">{houseDetails.title}</h1>
      <div className="flex gap-4">
        <img
          src={houseDetails.photos.main}
          alt={houseDetails.title}
          className="w-1/2 object-cover object-center rounded-2xl"
        />
        <div className="grid grid-cols-2 gap-4 w-1/2">
          {houseDetails.photos.images.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={houseDetails.title}
              className="w-full h-full object-cover object-center rounded-2xl"
            />
          ))}
        </div>
      </div>
      <div className="shadow-lg rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="font-bold text-xl">
              {houseType} located at {address.formatted}
            </span>
            <span className="block text-lg mt-2">
              {features.maxGuests} Guest{features.maxGuests > 1 ? "s" : ""} |{" "}
              {features.bedrooms} Bedroom{features.bedrooms > 1 ? "s" : ""} |{" "}
              {features.beds} Bed{features.beds > 1 ? "s" : ""} |{" "}
              {features.bathrooms} Bath{features.bathrooms > 1 ? "s" : ""}
            </span>
          </div>
          {/* <div className="flex items-center">
            <span className="mr-2">Rating:</span>
            <Rating value={averageRating} readOnly cancel={false} />
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Amenities Card */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 p-6 shadow-shadow2 rounded-xl">
            {Object.entries(amenities).map(
              ([key, value]) =>
                value && (
                  <div
                    key={key}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-primary text-2xl">{icons[key]}</span>
                    <span className="text-sm font-semibold">{key}</span>
                  </div>
                )
            )}
          </div>
          {/* Rules Card */}
          <div className="shadow-shadow2 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Clock className="text-info text-3xl mr-2" />
              <span className="text-lg font-semibold">
                Check-In: {rules.checkIn}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <ClockAfternoon className="text-info text-3xl mr-2" />
              <span className="text-lg font-semibold">
                Check-Out: {rules.checkOut}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <Cigarette
                className={`text-${
                  !rules.smoking ? "error" : "primary"
                } text-3xl mr-2`}
              />
              <span className="text-lg font-semibold">
                {!rules.smoking ? "No Smoking" : "Smoking Allowed"}
              </span>
            </div>
            <div className="flex items-center">
              <PawPrint
                className={`text-${
                  !rules.pets ? "error" : "primary"
                } text-3xl mr-2`}
              />
              <span className="text-lg font-semibold">
                {rules.pets ? "Pets Allowed" : "No Pets Allowed"}
              </span>
            </div>
          </div>
          {/* Settings Card */}
          <div className="shadow-shadow2 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <CalendarDot className="text-info text-3xl mr-2" />
              <span className="text-lg font-semibold">
                Cancellation Days: {settings.cancellationDays}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <Percent className="text-info text-3xl mr-2" />
              <span className="text-lg font-semibold">
                Cancellation Percent: {settings.cancellationPercent}%
              </span>
            </div>
            <div className="flex items-center">
              <Sun className="text-primary text-3xl mr-2" />
              <span className="text-lg font-semibold">
                Change Days: {settings.changeDays}
              </span>
            </div>
          </div>
          <div className="shadow-shadow2 rounded-xl p-6 col-span-2 gap-2 flex justify-center items-center">
            <div
              className="flex flex-col gap-2 w-full
            "
            >
              <div
                key="checkin"
                className="flex items-center justify-between w-full"
              >
                <div className="font-bold">Check In:</div>
                <Calendar
                  inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
                  placeholder="Check-In"
                  minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
                  value={bookingForm.checkIn}
                  onChange={(e) =>
                    setBookingForm((prevValue) => ({
                      ...prevValue,
                      checkIn: e.value,
                      checkOut: "",
                    }))
                  }
                  dateFormat="mm/dd/yy"
                />
              </div>
              <div
                key="checkout"
                className="flex items-center justify-between w-full"
              >
                <div className="font-bold">Check In:</div>
                <Calendar
                  minDate={
                    bookingForm.checkIn
                      ? new Date(
                          new Date(bookingForm.checkIn).setDate(
                            new Date(bookingForm.checkIn).getDate() + 1
                          )
                        )
                      : null
                  }
                  inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
                  placeholder="Check-Out"
                  value={bookingForm.checkOut}
                  onChange={(e) =>
                    setBookingForm((prevValue) => ({
                      ...prevValue,
                      checkOut: e.value,
                    }))
                  }
                  dateFormat="mm/dd/yy"
                />
              </div>
            </div>
            <button
              className={`text-accent1 rounded-lg ml-auto h-fit p-2
              ${
                !isFormValid()
                  ? "bg-primary cursor-not-allowed"
                  : "bg-primary hover:bg-action"
              }`}
              onClick={handleBookingSubmit}
              disabled={!isFormValid()}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
