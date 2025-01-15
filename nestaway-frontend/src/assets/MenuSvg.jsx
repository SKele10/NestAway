import PropTypes from "prop-types";
const MenuSvg = ({ openNavigation }) => {
  return (
    <svg
      className="overflow-visible"
      width="20"
      height="12"
      viewBox="0 0 20 12"
    >
      <rect
        className="transition-all origin-center fill-accent1"
        y={openNavigation ? "5" : "0"}
        width="20"
        height="3"
        rx="1"
        transform={`rotate(${openNavigation ? "45" : "0"})`}
      />
      {!openNavigation && (
        <rect
          className="transition-all origin-center fill-accent1"
          y={openNavigation ? "5" : "7"}
          width="20"
          height="3"
          rx="1"
          fill="text-primary"
        />
      )}
      <rect
        className="transition-all origin-center fill-accent1"
        y={openNavigation ? "5" : "14"}
        width="20"
        height="3"
        rx="1"
        fill="text-primary"
        transform={`rotate(${openNavigation ? "-45" : "0"})`}
      />
    </svg>
  );
};

MenuSvg.propTypes = {
  openNavigation: PropTypes.bool.isRequired,
};

export default MenuSvg;
