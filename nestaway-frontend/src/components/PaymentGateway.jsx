import React, { useEffect, useState, useContext, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { GetHouseDetails, BookingURL, CreditsURL } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import TermsAndConditionsModule from "./TermsAndConditionsModule";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

function PaymentGateway() {
  const navigateTo = useNavigate();
  const location = useLocation();
  if (!location.state?.bookingForm) {
    window.location.href = "/";
  }
  const data = location.state?.bookingForm;
  let checkIn = "",
    checkOut = "",
    houseId = "";
  if (data) {
    checkIn = data.checkIn.toString();
    checkOut = data.checkOut.toString();
    houseId = data.houseid;
  }
  const [houseInfo, setHouseInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [nights, setNights] = useState(0);
  const [creditsBalance, setCreditsBalance] = useState(0);
  const [enoughBalance, setEnoughBalance] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let headers = {};
        if (currentUser) {
          headers = {
            Authorization: `Bearer ${currentUser.accessToken}`,
          };
        }
        const balanceResponse = await axios.get(BaseURL + CreditsURL, {
          headers,
        });
        setCreditsBalance(balanceResponse.data);
        const houseResponse = await axios.get(
          BaseURL + GetHouseDetails + houseId,
          { headers }
        );
        const fetchedHouseInfo = houseResponse.data;
        setHouseInfo(houseResponse.data);

        const differenceInTime =
          new Date(checkOut).getTime() - new Date(checkIn).getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        const numberOfDays = Math.round(differenceInDays);

        setNights(numberOfDays);

        const st = numberOfDays * fetchedHouseInfo.price;
        setSubtotal(parseFloat(st.toFixed(2)));

        // const t = st * 0.06625;
        // setTaxes(parseFloat(t.toFixed(2)));

        const sf = st * 0.142;
        setServiceFee(parseFloat(sf.toFixed(2)));

        const tp = st + sf + 100;
        setTotalPrice(parseFloat(tp.toFixed(2)));
        const enoughResponse = await axios.post(
          BaseURL + CreditsURL + "checkCredits",
          { creditsToCheck: parseFloat(tp.toFixed(2)) },
          { headers }
        );
        setEnoughBalance(enoughResponse.data);
        if (!enoughResponse.data) {
          setError("Your credits balance now is not enough!");
        }
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, [houseId, checkIn, checkOut, currentUser]);

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

  if (!currentUser) {
    return navigateTo("/");
  }
  //   const changePaidState = () => {
  //     setPaid(true);
  //   };

  //   const getPaymentInfo = (paymentInfo) => {
  //     setPaymentInfo(paymentInfo);
  //   };
  const openModule = () => {
    setIsModalOpen(true);
  };

  const closeModule = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setPaySuccess(false);
    window.location.href = "/";
  };

  const onClickComfirm = async (e) => {
    e.preventDefault();
    const bookingInfo = {
      checkIn: checkIn,
      checkOut: checkOut,
      houseId: houseInfo._id.toString(),
      userId: currentUser.uid,
    };
    try {
      let headers = {};
      if (currentUser) {
        headers = {
          Authorization: `Bearer ${currentUser.accessToken}`,
        };
      }
      const addedBooking = await axios.post(
        BaseURL + BookingURL + "addBooking",
        bookingInfo,
        { headers }
      );
      if (addedBooking.data.success) {
        await axios.post(
          BaseURL + CreditsURL + "deduct",
          { creditsToDeduct: totalPrice },
          { headers }
        );
        setPaySuccess(true);
      }
    } catch (e) {
      console.log(e.response.data.error);
      setError(e.response.data.error);
    }
  };

  return (
    <div className="relative mx-auto w-full bg-accent1">
      <div className="grid min-h-screen grid-cols-10">
        {/* Left Section */}
        <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="relative text-2xl font-medium text-accent2 sm:text-3xl">
              Secure Checkout
              <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span>
            </h1>
            <div className="text-center mt-8">
              <h2 className="text-3xl font-bold text-accent2 mb-4">
                Pay with NestAway credits
              </h2>
              <div
                className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
                role="alert"
              >
                <p className="font-bold">Your credits balance is:</p>
                <p className="text-xl">{creditsBalance}</p>
              </div>
            </div>
            {/* Terms and Conditions */}
            <div className="mt-10 text-center text-sm font-semibold text-accent2">
              By placing this order you agree to the{" "}
              <a
                onClick={openModule}
                className="whitespace-nowrap text-primary underline hover:text-action cursor-pointer"
              >
                Terms and Conditions
              </a>
            </div>
            {isModalOpen ? (
              <TermsAndConditionsModule
                isOpen={openModule}
                onClose={closeModule}
              />
            ) : (
              <></>
            )}
            {/* Place Order Button */}
            <button
              onClick={onClickComfirm}
              className={`mt-4 inline-flex w-full items-center justify-center rounded py-2.5 px-4 text-base font-semibold tracking-wide text-accent1 text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 ${
                !enoughBalance
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-action"
              }`}
              disabled={!enoughBalance}
            >
              Confirm and Pay
            </button>
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-error px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section (Order Summary) */}
        <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
          <h2 className="sr-only">Order summary</h2>
          {/* Order Items List */}
          <div>
            {/* Background Image */}
            <img
              src={houseInfo.photos.main}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 h-full w-full bg-primary opacity-95"></div>
          </div>
          {/* Order Details */}
          <div className="relative">
            <ul className="space-y-5">
              <li className="flex justify-between">
                <div className="inline-flex">
                  <img
                    src={houseInfo.photos.main}
                    alt=""
                    className="max-h-16"
                  />
                  <div className="ml-3">
                    <p className="text-base font-semibold text-accent1">
                      {houseInfo.title}
                    </p>
                    <p className="text-sm font-medium text-accent1 text-opacity-80">
                      {houseInfo.description}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-accent1">
                  ${houseInfo.price}
                </p>
              </li>
            </ul>
            {/* Separator Line */}
            <div className="my-5 h-0.5 w-full bg-accent1 bg-opacity-30"></div>
            {/* Total and VAT */}
            <div className="space-y-2">
              <p className="flex justify-between text-lg font-bold text-accent1">
                <span>Total price(including taxes):</span>
                <span>${totalPrice}</span>
              </p>
              <p className="flex justify-between text-sm font-medium text-accent1">
                <span>
                  ${houseInfo.price} x {nights} nights:
                </span>
                <span>${subtotal}</span>
              </p>
              <p className="flex justify-between text-sm font-medium text-accent1">
                <span>Cleaning fee:</span>
                <span>$100.00</span>
              </p>
              <p className="flex justify-between text-sm font-medium text-accent1">
                <span>Nestaway service fee:</span>
                <span>${serviceFee}</span>
              </p>
              {/* <p className="flex justify-between text-sm font-medium text-white">
                                <span>Taxes:</span>
                                <span>${taxes}</span>
                            </p> */}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="relative mt-10 flex bg-warning rounded-lg p-4">
            <div className="flex flex-col text-accent1">
              <span className="text-sm font-bold">
                Cancellation & Change Policy
              </span>
              <span className="text-xs mt-2">
                <strong>Cancellation:</strong> If a guest cancels their booking
                more than {houseInfo.settings.cancellationDays} days before the
                booking date, they are eligible for a full refund. If a guest
                cancels within 7 days of the booking date, they will receive a
                refund amounting to {houseInfo.settings.cancellationPercent}% of
                the total booking cost.
                <br />
                <strong>Change:</strong> Guests can modify or change their
                booking details (such as dates or number of guests) up to{" "}
                {houseInfo.settings.changeDays} days before the booking date
                without incurring any penalty or additional charges.
              </span>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header={"Payment Successful"}
        visible={paySuccess}
        style={{ width: "50vw", height: "50vh" }}
        onHide={() => handleClose()}
        className="font-didact bg-accent1 overflow"
      >
        <div className="bg-accent1 h-full text-accent2">
          <div className=" p-6 md:mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="text-primary w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-accent2 font-semibold text-center">
                Payment Done!
              </h3>
              <p className="text-accent2 my-2">
                Thank you for completing your credit online payment.
              </p>
              <p>Have a great day!</p>
              <div className="py-10 text-center">
                <a
                  href="/"
                  className={`text-primary rounded-lg ml-auto p-2 border-2 border-primary  hover:bg-primary hover:text-accent1`}
                >
                  GO HOME
                </a>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default PaymentGateway;
