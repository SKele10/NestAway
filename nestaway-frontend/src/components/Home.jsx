import { useCallback, useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Geoview from "./Geoview";
import ThemeContext from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHouses, setMapCenter } from "../store/houseSlice";
import { checkIfAdminAsync } from "../store/authSlice";

const Home = () => {
  const [distances, setDistances] = useState({});
  const [view, setView] = useState("map");
  const { toggleSearchVisible } = useContext(ThemeContext);

  const houseData = useSelector((state) => state.houses.houseData);
  const mapCenter = useSelector((state) => state.houses.mapCenter);

  const dispatch = useDispatch();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setMapCenter([latitude, longitude]));
      });
    } else {
      dispatch(setMapCenter([40.75776183421434, -74.04708689910295]));
    }
  }, [dispatch]);

  useEffect(() => {
    toggleSearchVisible(true);
    dispatch(fetchHouses());
  }, [dispatch, toggleSearchVisible]);

  const calculateDistance = useCallback(
    async (nestLat, nestLong) => {
      const earthRadiusMiles = 3958.8; // Earth's radius in miles

      const dLat = toRadians(nestLat - mapCenter[0]);
      const dLon = toRadians(nestLong - mapCenter[1]);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(mapCenter[0])) *
          Math.cos(toRadians(nestLat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadiusMiles * c;
      return Math.ceil(distance);
    },
    [mapCenter]
  );

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  useEffect(() => {
    const fetchDistances = async () => {
      const distances = {};
      for (const house of houseData) {
        if (mapCenter[0] && mapCenter[1]) {
          const distance = await calculateDistance(
            house.address?.location.coordinates[1],
            house.address?.location.coordinates[0]
          );
          distances[house._id] = distance;
        }
      }
      setDistances(distances);
    };

    if (mapCenter && mapCenter[0] && mapCenter[1]) {
      fetchDistances();
    }
  }, [calculateDistance, houseData, mapCenter]);

  return (
    <div className={`font-didact bg-secondary text-accent2 min-h-[91.5vh]`}>
      {view === "list" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6">
          {houseData &&
            houseData.map((house) => (
              <Link
                key={house._id}
                to={`/house/${house._id}`}
                className="bg-accent1  shadow-shadow2 rounded-lg overflow-hidden hover:bg-secondary cursor-pointer"
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
                <div className="p-4 text-accent2">
                  <h3 className="text-lg font-semibold mb-2">{house.title}</h3>
                  <p className="text-accent2 mb-2">
                    Price per night: ${house.price}
                  </p>
                  <p className="text-accent2 mb-2">
                    Location: {house.address.address_line1}
                  </p>
                  {distances[house._id] && (
                    <p className="text-accent2 mb-2">
                      Distance: {distances[house._id]} miles
                    </p>
                  )}
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <div className="h-full">
          <Geoview data={houseData} />
        </div>
      )}

      <div
        className="fixed bottom-10 z-50 left-0 right-0 mx-auto bg-primary text-accent1 py-2 px-4 rounded-3xl shadow-shadow1 flex justify-center items-center max-w-fit cursor-pointer hover:bg-action"
        onClick={() => setView(view === "list" ? "map" : "list")}
      >
        {view === "list" ? "Geoview" : "List"} View
      </div>
    </div>
  );
};

export default Home;
