import { useState } from "react";
import PropTypes from "prop-types";

const ButtonGroup = ({ buttons, selectedButton, handleButtonClick }) => {
  return (
    <>
      {buttons.map((button) => (
        <button
          key={button.name}
          className={`mx-2 rounded-lg p-2 border-primary border-2 hover:bg-primary hover:text-accent1 ${
            selectedButton === button.name
              ? "bg-primary text-accent1"
              : "text-primary"
          }`}
          onClick={() => handleButtonClick(button.name)}
        >
          {button.label}
        </button>
      ))}
    </>
  );
};

ButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedButton: PropTypes.string.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
};

export { ButtonGroup };
