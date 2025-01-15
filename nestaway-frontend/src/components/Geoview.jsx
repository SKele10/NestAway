import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Carousel } from "react-responsive-carousel";
import ThemeContext from "../contexts/ThemeContext";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import millify from "millify";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchHousesByState, setIsDrag, setQuery } from "../store/houseSlice";

const Geoview = ({ data }) => {
  const { theme } = useContext(ThemeContext);
  const map = useRef(null);
  const [mapZoom, setMapZoom] = useState(10);
  const mapCenter = useSelector((state) => state.houses.mapCenter);
  const isDrag = useSelector((state) => state.houses.isDrag);

  const dispatch = useDispatch();

  const markers = (price) => {
    return new L.divIcon({
      html: `<div>$${millify(price)}</div>`,
      className:
        "bg-primary text-accent1 flex justify-content items-center w-full rounded-3xl font-extrabold font-comic p-2 hover:bg-action",
      iconSize: [45, 30],
      iconAnchor: [22.5, 5],
    });
  };

  const calculateRadius = (zoomLevel) => {
    return Math.pow(2, 14 - zoomLevel) * 8;
  };

  const handleDragEnd = (event) => {
    dispatch(setIsDrag(true));
    const center = event.target.getCenter();
    dispatch(
      setQuery({
        state: "",
        checkIn: "",
        checkOut: "",
        lat: center.lat,
        lng: center.lng,
        radius: calculateRadius(mapZoom),
      })
    );

    dispatch(searchHousesByState());
  };

  const handleZoomChange = (event) => {
    setMapZoom(event.target.getZoom());
  };

  const DragEvents = () => {
    useMapEvents({
      dragend: handleDragEnd,
      zoomend: handleZoomChange,
    });

    return null;
  };
  const getTileLayerClassName = useCallback(() => {
    return theme === "light" ? "customLayerLight" : "customLayerDark";
  }, [theme]);

  useEffect(() => {
    if (map.current && !isDrag) {
      if (data[0]?.address.location?.coordinates) {
        const { coordinates } = data[0].address.location;
        const latLng = L.latLng(coordinates[1], coordinates[0]);
        map.current.panTo(latLng);
        map.current.setZoom(8);
      }
    }
  }, [data, isDrag]);

  // useEffect(() => {
  //   if (Array.isArray(mapCenter)) {
  //     dispatch(
  //       setQuery({
  //         state: "",
  //         checkIn: "",
  //         checkOut: "",
  //         lat: mapCenter[1],
  //         lng: mapCenter[0],
  //         radius: calculateRadius(mapZoom),
  //       })
  //     );
  //     dispatch(searchHousesByState());
  //   }
  // }, [dispatch, mapCenter, mapZoom]);

  return (
    <MapContainer
      ref={map}
      zoomControl={true}
      className="h-[91.5vh] z-10 font-didact"
      dragging={true}
      minZoom={5}
      maxZoom={17}
      zoom={mapZoom}
      center={mapCenter || [40.757957305672726, -74.0471129340117]}
      maxBounds={[
        [51, -128],
        [22, -64],
      ]}
    >
      <RerenderMap />
      <DragEvents />
      <TileLayer
        className={"customLayerLight"}
        url={"http://{s}.tile.osm.org/{z}/{x}/{y}.png"}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MarkerClusterGroup chunkedLoading>
        {data &&
          Array.isArray(data) &&
          data.map((house) => (
            <Marker
              key={house._id}
              position={[
                house.address.location.coordinates[1],
                house.address.location.coordinates[0],
              ]}
              icon={markers(house.price)}
            >
              <Popup>
                <Link
                  to={`/house/${house._id}`}
                  key={house.house_id}
                  className="bg-accent1 text-accent2 shadow-shadow2 rounded-lg overflow-hidden hover:bg-secondary h-full w-full cursor-pointer font-didact"
                >
                  <Carousel
                    showThumbs={false}
                    showIndicators={true}
                    showStatus={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={5000}
                    className="max-w-screen-lg"
                  >
                    {house.photos &&
                      house.photos.images &&
                      house.photos.images.map((photo, index) => (
                        <img
                          key={house._id + index}
                          src={photo}
                          alt={house.title}
                          className="w-full h-60 object-cover object-center"
                        />
                      ))}
                  </Carousel>
                  <div className="p-4 bg-accent1 text-accent2 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                      {house.title}
                    </h3>
                    <p className="text-accent2 mb-2">
                      Price per night: ${house.price}
                    </p>
                    <p className="text-accent2 mb-2">
                      Location: {house.address.address_line1}
                    </p>
                  </div>
                </Link>
              </Popup>
            </Marker>
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

Geoview.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      address: PropTypes.shape({
        location: PropTypes.shape({
          coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
        }).isRequired,
        address_line1: PropTypes.string.isRequired,
      }).isRequired,
      photos: PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.string),
      }),
      price: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Geoview;

const RerenderMap = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
};
