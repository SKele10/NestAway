import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Knob } from "primereact/knob";
import { ToggleButton } from "primereact/togglebutton";
import PropTypes from "prop-types";

const StepFour = ({
  details,
  setDetails,
  rules,
  setRules,
  policies,
  setPolicies,
}) => {
  const [titleChars, setTitleChars] = useState(details?.title.length);
  const [descChars, setDescChars] = useState(details?.description.length);
  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    if (newTitle.length <= 32) {
      setDetails((prevState) => ({ ...prevState, title: newTitle }));
      setTitleChars(newTitle.length);
    }
  };

  const handleDescChange = (event) => {
    const newDesc = event.target.value;
    if (newDesc.length <= 500) {
      setDetails((prevState) => ({ ...prevState, description: newDesc }));
      setDescChars(newDesc.length);
    }
  };
  return (
    <div className="flex h-[55vh] justify-between w-full mx-16">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="title">Title:</label>
          <div className="flex flex-col">
            <InputText
              id="title"
              value={details.title}
              onChange={handleTitleChange}
              className="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
            />
            {titleChars}/32
          </div>
        </div>
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="description">Description:</label>
          <div className="flex flex-col">
            <InputTextarea
              id="description"
              value={details.description}
              onChange={handleDescChange}
              rows={5}
              className="w-fit h-fit max-h-64 bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
            />
            {descChars}/500
          </div>
        </div>

        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="price">Price:</label>
          <InputNumber
            id="price"
            value={details.price}
            onChange={(e) =>
              setDetails((prevState) => ({ ...prevState, price: e.value }))
            }
            mode="currency"
            currency="USD"
            locale="en-US"
            inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
          />
        </div>
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="smoking">Smoking:</label>
          <ToggleButton
            id="smoking"
            checked={rules.smoking}
            onChange={(e) =>
              setRules((prevValue) => ({
                ...prevValue,
                smoking: e.value,
              }))
            }
            className={`w-24 rounded-lg ${
              rules.smoking
                ? "bg-action text-accent1"
                : "bg-accent1 text-accent2"
            }`}
          />
        </div>
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="pets">Pets:</label>
          <ToggleButton
            id="pets"
            checked={rules.pets}
            onChange={(e) =>
              setRules((prevValue) => ({
                ...prevValue,
                pets: e.value,
              }))
            }
            className={`w-24 rounded-lg ${
              rules.pets ? "bg-action text-accent1" : "bg-accent1 text-accent2"
            }`}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="cancellationDays">Cancellation Days:</label>
          <InputNumber
            min={1}
            value={policies.cancellationDays}
            onChange={(e) =>
              setPolicies((prevValue) => ({
                ...prevValue,
                cancellationDays: e.value,
              }))
            }
            showButtons
            buttonLayout="horizontal"
            inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
            decrementButtonClassName="bg-error text-accent1"
            incrementButtonClassName="bg-primary text-accent1"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="cancellationPercent">Cancellation Percent:</label>
          <div className="flex-grow">
            <Knob
              id="cancellationPercent"
              value={policies.cancellationPercent}
              onChange={(e) =>
                setPolicies((prevValue) => ({
                  ...prevValue,
                  cancellationPercent: e.value,
                }))
              }
            />
          </div>
        </div>
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="changeDays">Change Days:</label>
          <InputNumber
            id="changeDays"
            min={1}
            value={policies.changeDays}
            onChange={(e) =>
              setPolicies((prevValue) => ({
                ...prevValue,
                changeDays: e.value,
              }))
            }
            showButtons
            buttonLayout="horizontal"
            inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
            decrementButtonClassName="bg-error text-accent1"
            incrementButtonClassName="bg-primary text-accent1"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="checkIn">Check In:</label>
          <InputNumber
            tooltip="Check In Hour"
            id="checkIn"
            min={1}
            max={24}
            value={rules.checkIn}
            onChange={(e) =>
              setRules((prevValue) => ({
                ...prevValue,
                checkIn: e.value,
              }))
            }
            showButtons
            buttonLayout="horizontal"
            inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
            decrementButtonClassName="bg-error text-accent1"
            incrementButtonClassName="bg-primary text-accent1"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
        <div className="flex w-full justify-between items-center gap-4">
          <label htmlFor="checkOut">Check Out:</label>
          <InputNumber
            tooltip="Check Out Hour"
            id="checkOut"
            min={1}
            max={24}
            value={rules.checkOut}
            onChange={(e) =>
              setRules((prevValue) => ({
                ...prevValue,
                checkOut: e.value,
              }))
            }
            showButtons
            buttonLayout="horizontal"
            inputClassName="w-fit h-fit bg-accent1 rounded-lg border-primary border-2 px-4 py-2 text-accent2 focus:shadow-none focus-visible:outline-none"
            decrementButtonClassName="bg-error text-accent1"
            incrementButtonClassName="bg-primary text-accent1"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
      </div>
    </div>
  );
};

StepFour.propTypes = {
  details: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  setDetails: PropTypes.func.isRequired,
  rules: PropTypes.shape({
    smoking: PropTypes.bool.isRequired,
    pets: PropTypes.bool.isRequired,
    checkIn: PropTypes.number.isRequired,
    checkOut: PropTypes.number.isRequired,
  }).isRequired,
  setRules: PropTypes.func.isRequired,
  policies: PropTypes.shape({
    cancellationDays: PropTypes.number.isRequired,
    cancellationPercent: PropTypes.number.isRequired,
    changeDays: PropTypes.number.isRequired,
  }).isRequired,
  setPolicies: PropTypes.func.isRequired,
};

export default StepFour;
