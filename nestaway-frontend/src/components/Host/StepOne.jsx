import { useCallback, useContext, useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import ThemeContext from "../../contexts/ThemeContext";
import Map from "./Map";
import axios from "axios";
import PropTypes from "prop-types";
import { houseTypes } from "../../constants";

const StepOne = ({
  houseType,
  setHouseType,
  houseAddress,
  setHouseAddress,
}) => {
  const { theme } = useContext(ThemeContext);
  const [addressOptions, setAddressOptions] = useState([]);

  const fetchAddress = useCallback(
    async (query) => {
      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            query
          )}&filter=countrycode:us&format=json&apiKey=6ce0477b523f47759dbad5b68b1efe77`
        );
        const filteredAddresses = response.data.results.filter(
          (address) => "housenumber" in address
        );
        setAddressOptions(filteredAddresses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [setAddressOptions]
  );

  const addressOptionTemplate = (option) => (
    <span className="font-bold p-1 rounded-lg">
      {option.housenumber && option.housenumber}{" "}
      {option.street && option.street}{" "}
      <span className="font-normal">
        {option.city && option.city}, {option.state && option.state},{" "}
        {option.postcode && option.postcode}
      </span>
    </span>
  );

  useEffect(() => {
    return () => {
      setAddressOptions([]);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex items-center">
        <div className="w-fit text-accent2 whitespace-nowrap">House Type</div>
        <div className="flex flex-wrap">
          {houseTypes.map((house, index) => (
            <div
              key={index}
              className={`w-1/6 mx-4 my-1 rounded-lg shadow-md p-2 flex items-center hover:border-primary border-2 cursor-pointer ${
                house.type === houseType
                  ? "bg-primary text-accent1"
                  : "bg-accent1"
              }`}
              onClick={() => {
                setHouseType(house.type);
              }}
            >
              <img
                className={`${
                  theme === "light"
                    ? house.type === houseType
                      ? "invert"
                      : ""
                    : house.type === houseType
                    ? ""
                    : "invert"
                }`}
                src={house.icon}
                width={30}
                height={30}
                alt="logo"
              />
              <div className="ml-4">{house.type}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-b border-accent2 w-full"></div>
      <div className="flex gap-2 justify-between items-center w-full">
        <AutoComplete
          panelClassName="bg-accent1"
          inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
          value={houseAddress}
          suggestions={addressOptions}
          completeMethod={(e) => {
            if (e.query.trim() !== "" && e.query.trim().length > 3) {
              fetchAddress(e.query);
            } else {
              setAddressOptions([]);
            }
          }}
          invalid={typeof houseAddress === "string"}
          field="address_line1"
          itemTemplate={addressOptionTemplate}
          placeholder="Enter House Address"
          onChange={(e) => setHouseAddress(e.value)}
        />
        {houseAddress && typeof houseAddress === "object" && (
          <>
            <div className="bg-accent1 text-accent2 p-4 rounded-lg shadow-md whitespace-nowrap">
              <p className="mb-2">
                <span className="font-semibold">Street:</span>{" "}
                {houseAddress.street}
              </p>
              <p className="mb-2">
                <span className="font-semibold">House Number:</span>{" "}
                {houseAddress.housenumber}
              </p>
              <p className="mb-2">
                <span className="font-semibold">City:</span> {houseAddress.city}
              </p>
              <p className="mb-2">
                <span className="font-semibold">State:</span>{" "}
                {houseAddress.state}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Postcode:</span>{" "}
                {houseAddress.postcode}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Country:</span>{" "}
                {houseAddress.country}
              </p>
            </div>
            {houseAddress.lat && houseAddress.lon ? (
              <Map
                street={houseAddress.address_line1}
                position={[houseAddress.lat, houseAddress.lon]}
              />
            ) : (
              <Map
                street={houseAddress?.address_line1}
                position={[
                  houseAddress?.location.coordinates[1],
                  houseAddress?.location.coordinates[0],
                ]}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

StepOne.propTypes = {
  houseType: PropTypes.string.isRequired,
  setHouseType: PropTypes.func.isRequired,
  houseAddress: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  setHouseAddress: PropTypes.func.isRequired,
};

export default StepOne;
