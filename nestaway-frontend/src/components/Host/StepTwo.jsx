import { InputNumber } from "primereact/inputnumber";
import ac from "/amenities/ac.png";
import carbonMonoxideDetector from "/amenities/carbon-monoxide-detector.png";
import dryer from "/amenities/dryer.png";
import fireExtinguisher from "/amenities/fire-extinguisher.png";
import fireplace from "/amenities/fireplace.png";
import firstAidKit from "/amenities/first-aid.png";
import gym from "/amenities/gym.png";
import heating from "/amenities/heating.png";
import kitchen from "/amenities/kitchen.png";
import parking from "/amenities/parking.png";
import pool from "/amenities/pool.png";
import smokeDetector from "/amenities/smoke-detector.png";
import hotTub from "/amenities/tub.png";
import tv from "/amenities/tv.png";
import washer from "/amenities/washer.png";
import wifi from "/amenities/wifi.png";
import { useContext } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import PropTypes from "prop-types";

const StepTwo = ({
  features,
  handleFeatureChange,
  amenities,
  handleAmenityToggle,
}) => {
  const generateLabel = (feature) => {
    return feature.charAt(0).toUpperCase() + feature.slice(1);
  };

  const { theme } = useContext(ThemeContext);

  const getImageSource = (amenity) => {
    switch (amenity) {
      case "wifi":
        return wifi;
      case "tv":
        return tv;
      case "ac":
        return ac;
      case "kitchen":
        return kitchen;
      case "parking":
        return parking;
      case "pool":
        return pool;
      case "gym":
        return gym;
      case "hotTub":
        return hotTub;
      case "fireplace":
        return fireplace;
      case "washer":
        return washer;
      case "dryer":
        return dryer;
      case "heating":
        return heating;
      case "smokeDetector":
        return smokeDetector;
      case "carbonMonoxideDetector":
        return carbonMonoxideDetector;
      case "firstAidKit":
        return firstAidKit;
      case "fireExtinguisher":
        return fireExtinguisher;
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex items-center text-accent2 flex-col gap-1 px-4">
        {Object.entries(features).map(([feature, value]) => (
          <div
            key={feature}
            className="flex items-center justify-between w-full"
          >
            <div className="font-bold">{generateLabel(feature)}:</div>
            <InputNumber
              min={1}
              value={value}
              onChange={(e) => handleFeatureChange(feature, e.value)}
              showButtons
              buttonLayout="horizontal"
              inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
              decrementButtonClassName="bg-error text-accent1"
              incrementButtonClassName="bg-primary text-accent1"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </div>
        ))}
      </div>
      <div className="border-b border-accent2 w-full"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(amenities).map(([amenity, status]) => (
          <div
            key={amenity}
            className={`rounded-md p-4 border-primary border-2 ${
              status ? "bg-primary text-accent1" : "text-accent2"
            } cursor-pointer hover:bg-action hover:text-accent1`}
            onClick={() => handleAmenityToggle(amenity)}
          >
            <div className="flex items-center">
              <img
                className={`${
                  theme === "light"
                    ? status
                      ? "invert"
                      : ""
                    : status
                    ? ""
                    : "invert"
                } w-6 h-6 mr-2`}
                src={getImageSource(amenity)}
                alt={amenity}
              />
              <span>{generateLabel(amenity)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StepTwo.propTypes = {
  features: PropTypes.object.isRequired,
  handleFeatureChange: PropTypes.func.isRequired,
  amenities: PropTypes.object.isRequired,
  handleAmenityToggle: PropTypes.func.isRequired,
};

export default StepTwo;
