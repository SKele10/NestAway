import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import PropTypes from "prop-types";

const ListingPreview = ({ house }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="flex w-full h-full gap-4">
      <img
        src={house.photos.main}
        alt={house.title}
        className="object-cover object-center w-2/3"
      />
      <div className="flex flex-col justify-between w-2/3">
        <p className="text-3xl font-extrabold">{house.title}</p>
        <div className="text-lg flex font-bold items-center gap-4">
          <div className="flex flex-col">
            <span>
              {house.houseType} hosted by {currentUser.displayName}
            </span>
            <span className="flex text-sm">
              {house.features.maxGuests} Guest
              {house.features.maxGuests > 1 && "s"} | {house.features.bedrooms}{" "}
              Bedroom
              {house.features.bedrooms > 1 && "s"} | {house.features.beds} Bed
              {house.features.beds > 1 && "s"} | {house.features.bathrooms} Bath
              {house.features.bathrooms > 1 && "s"}
            </span>
          </div>
          <img
            src={currentUser.photoURL}
            className="h-10 object-cover object-center rounded-full"
          />
        </div>
        <div className="border-b border-accent2 w-full"></div>
        <p>{house.description}</p>
        <div className="border-b border-accent2 w-full"></div>
        <p className="font-semibold text-normal">Location</p>
        <p className="font-semibold text-lg">{house.address.formatted}</p>
      </div>
    </div>
  );
};

ListingPreview.propTypes = {
  house: PropTypes.shape({
    photos: PropTypes.shape({
      main: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    houseType: PropTypes.string.isRequired,
    features: PropTypes.shape({
      maxGuests: PropTypes.number.isRequired,
      bedrooms: PropTypes.number.isRequired,
      beds: PropTypes.number.isRequired,
      bathrooms: PropTypes.number.isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
    address: PropTypes.shape({
      formatted: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ListingPreview;
