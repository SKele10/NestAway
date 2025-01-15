import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useContext } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import PropTypes from "prop-types";

const Map = ({ street, position }) => {
  const { theme } = useContext(ThemeContext);
  const markerSize = 40;
  const marker =
    '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" height="100%">    <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"/></svg>';
  const markers = () =>
    new L.divIcon({
      html: marker,
      className: "fill-primary",
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize],
    });

  return (
    <MapContainer
      zoomControl={false}
      className="h-[250px] w-full rounded-lg"
      dragging={false}
      minZoom={17}
      maxZoom={17}
      zoom={17}
      center={position}
    >
      <TileLayer
        className={"customLayerLight"}
        url={"http://{s}.tile.osm.org/{z}/{x}/{y}.png"}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={markers()}>
        {/* <Popup className="">{street}</Popup> */}
      </Marker>
    </MapContainer>
  );
};

Map.propTypes = {
  street: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Map;
