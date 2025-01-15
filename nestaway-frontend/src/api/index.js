import axios from "axios";

export const HostURL = "/host/getHosting";
export const NewUserURL = "/user/newuser";
export const BookingURL = "/booking/";
export const CreditsURL = "/credits/";
export const GetUniqueStates = "/search/getUniqueStates";
export const GetHouses = "/search/";
export const GetHouseDetails = "/host/";
export const GetHousesByHost = "/host/housesbyhost";
export const GetAllPending = "/host/pending";
export const ApproveHouse = "/host/approve/";
export const RejectHouse = "/host/reject/";
export const CheckAdmin = "/host/checkadmin";
export const GetSearchByLatLng = "/search/searchByLatLng/";
export const TripURL = "/trip/";
export const SendEmailURL = "/sendemail/accemail"

export default axios.create({
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});
