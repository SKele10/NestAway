import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { validHouseTypes } from "../../constants";
import PropTypes from "prop-types";

const ListingWizard = ({ active, mode, onClose, houseDetails }) => {
  const stepperRef = useRef(null);
  const [houseType, setHouseType] = useState(houseDetails.houseType);
  const [houseAddress, setHouseAddress] = useState(houseDetails.houseAddress);
  const [photos, setPhotos] = useState(houseDetails.photos);
  const [features, setFeatures] = useState(houseDetails.features);
  const [amenities, setAmenities] = useState(houseDetails.amenities);
  const [details, setDetails] = useState(houseDetails.details);
  const [policies, setPolicies] = useState(houseDetails.policies);
  const [rules, setRules] = useState(houseDetails.rules);

  const handleFeatureChange = (feature, value) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [feature]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setAmenities((prevAmenities) => ({
      ...prevAmenities,
      [amenity]: !prevAmenities[amenity],
    }));
  };

  const validateStepOne = () => {
    return (
      houseType !== "" &&
      validHouseTypes.includes(houseType) &&
      houseAddress &&
      typeof houseAddress === "object" &&
      houseAddress.housenumber &&
      houseAddress.street &&
      houseAddress.city &&
      houseAddress.state
    );
  };

  const validateStepThree = () => {
    return (
      photos &&
      typeof photos === "object" &&
      photos.main &&
      photos.images &&
      typeof photos.images === "object" &&
      photos.images.length > 2
    );
  };
  const validateStepFour = () => {
    return (
      details &&
      typeof details === "object" &&
      details.price &&
      details.description &&
      details.title &&
      details.description.trim() &&
      details.title.trim()
    );
  };

  const accept = useCallback(() => {
    onClose();
    setHouseType(houseDetails.houseType);
    setHouseAddress(houseDetails.houseAddress);
    setPhotos(houseDetails.photos);
    setFeatures(houseDetails.features);
    setAmenities(houseDetails.amenities);
    setDetails(houseDetails.details);
    setPolicies(houseDetails.policies);
    setRules(houseDetails.rules);
  }, [
    houseDetails.amenities,
    houseDetails.details,
    houseDetails.features,
    houseDetails.houseAddress,
    houseDetails.houseType,
    houseDetails.photos,
    houseDetails.policies,
    houseDetails.rules,
    onClose,
  ]);

  const reject = () => {};

  const handleClose = useCallback(() => {
    confirmDialog({
      message:
        "Are you sure you want to close the Listing Wizard? Any information you've added will be lost.",
      header: "Confirm Action",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName:
        "text-error rounded-lg ml-2 p-2 border-2 border-error  hover:bg-error hover:text-accent1",
      rejectClassName:
        "text-primary rounded-lg p-2 border-2 border-primary  hover:bg-primary hover:text-accent1",
      accept,
      reject,
    });
  }, [accept]);
  const steps = [
    {
      header: "Address",
      body: (
        <StepOne
          houseType={houseType}
          setHouseType={setHouseType}
          houseAddress={houseAddress}
          setHouseAddress={setHouseAddress}
        />
      ),
      hasNextStep: true,
      hasPreviousStep: false,
      validate: validateStepOne,
    },
    {
      header: "Features",
      body: (
        <StepTwo
          features={features}
          handleFeatureChange={handleFeatureChange}
          amenities={amenities}
          handleAmenityToggle={handleAmenityToggle}
        />
      ),
      hasNextStep: true,
      hasPreviousStep: true,
    },
    {
      header: "Images",
      body: <StepThree photos={photos} setPhotos={setPhotos} />,
      hasNextStep: true,
      hasPreviousStep: true,
      validate: validateStepThree,
    },
    {
      header: "Details & Policies",
      body: (
        <StepFour
          details={details}
          setDetails={setDetails}
          rules={rules}
          setRules={setRules}
          policies={policies}
          setPolicies={setPolicies}
        />
      ),
      hasNextStep: true,
      hasPreviousStep: true,
      validate: validateStepFour,
    },
    {
      header: "Publish",
      body: (
        <StepFive
          accept={accept}
          mode={mode}
          house={{
            _id: houseDetails._id,
            houseType,
            photos,
            title: details.title,
            price: details.price,
            description: details.description,
            currency: "USD",
            address: {
              country: houseAddress.country,
              country_code: houseAddress.country_code,
              state: houseAddress.state,
              county: houseAddress.county,
              city: houseAddress.city,
              postcode: houseAddress.postcode,
              street: houseAddress.street,
              housenumber: houseAddress.housenumber,
              location: {
                type: "Point",
                coordinates: houseAddress?.location?.coordinates
                  ? [
                      houseAddress?.location.coordinates[0],
                      houseAddress?.location.coordinates[1],
                    ]
                  : [houseAddress?.lon, houseAddress?.lat],
              },
              state_code: houseAddress.state_code,
              result_type: houseAddress.result_type,
              formatted: houseAddress.formatted,
              address_line1: houseAddress.address_line1,
              address_line2: houseAddress.address_line2,
            },
            features,
            amenities,
            settings: policies,
            rules,
          }}
        />
      ),
      hasNextStep: false,
      hasPreviousStep: true,
    },
  ];

  useEffect(() => {
    setHouseType(houseDetails.houseType);
    setHouseAddress(houseDetails.houseAddress);
    setPhotos(houseDetails.photos);
    setFeatures(houseDetails.features);
    setAmenities(houseDetails.amenities);
    setDetails(houseDetails.details);
    setPolicies(houseDetails.policies);
    setRules(houseDetails.rules);
  }, [
    houseDetails.amenities,
    houseDetails.details,
    houseDetails.features,
    houseDetails.houseAddress,
    houseDetails.houseType,
    houseDetails.photos,
    houseDetails.policies,
    houseDetails.rules,
  ]);

  return (
    <Dialog
      header={mode ? "Update Listing" : "Add Listing"}
      visible={active}
      style={{ width: "85vw", height: "85vh" }}
      onHide={() => handleClose()}
      className="font-didact bg-accent1 overflow"
    >
      <ConfirmDialog />
      <Stepper ref={stepperRef} linear>
        {steps &&
          steps.map((step) => (
            <StepperPanel key={step.header} header={step.header}>
              <div className="flex flex-column h-12rem">
                <div className="flex-auto flex justify-center items-center font-medium">
                  {step.body}
                </div>
              </div>
              <div className="flex pt-4 justify-between space-x-4">
                <Button
                  label="Back"
                  hidden={!step.hasPreviousStep}
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  className="text-primary rounded-lg p-2 border-2 border-primary hover:bg-primary hover:text-accent1"
                  onClick={() => stepperRef.current.prevCallback()}
                />
                <div className="flex-grow"></div>{" "}
                <div className="flex items-center space-x-4">
                  <Button
                    hidden={!step.hasNextStep}
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    className="text-primary rounded-lg p-2 border-2 border-primary hover:bg-primary hover:text-accent1"
                    onClick={() => {
                      const isValid = step.validate ? step.validate() : true;
                      if (isValid) {
                        stepperRef.current.nextCallback();
                      }
                    }}
                    disabled={
                      !step.hasNextStep || (step.validate && !step.validate())
                    }
                  />
                </div>
              </div>
            </StepperPanel>
          ))}
      </Stepper>
    </Dialog>
  );
};

ListingWizard.propTypes = {
  active: PropTypes.bool.isRequired,
  mode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  houseDetails: PropTypes.shape({
    _id: PropTypes.string,
    houseType: PropTypes.string.isRequired,
    houseAddress: PropTypes.shape({
      country: PropTypes.string.isRequired,
      country_code: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      county: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      postcode: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      housenumber: PropTypes.string.isRequired,
      location: PropTypes.shape({
        type: PropTypes.string.isRequired,
        coordinates: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
      }).isRequired,
      state_code: PropTypes.string.isRequired,
      result_type: PropTypes.string.isRequired,
      formatted: PropTypes.string.isRequired,
      address_line1: PropTypes.string.isRequired,
      address_line2: PropTypes.string.isRequired,
    }).isRequired,
    photos: PropTypes.shape({
      main: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
    features: PropTypes.shape({
      maxGuests: PropTypes.number.isRequired,
      bedrooms: PropTypes.number.isRequired,
      beds: PropTypes.number.isRequired,
      bathrooms: PropTypes.number.isRequired,
    }).isRequired,
    amenities: PropTypes.object.isRequired,
    details: PropTypes.shape({
      price: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    policies: PropTypes.object.isRequired,
    rules: PropTypes.object.isRequired,
  }).isRequired,
};

export default ListingWizard;
