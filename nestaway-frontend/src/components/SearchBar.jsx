import { useCallback, useEffect, useState } from "react";
import { GetUniqueStates } from "../api";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFilter,
  searchHousesByState,
  setIsDrag,
  setQuery,
} from "../store/houseSlice";
import moment from "moment";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;
const SearchBar = () => {
  const [uniqueStates, setUniqueStates] = useState([]);
  const [disabled, setDisabled] = useState(true);
  // const [query, setQuery] = useState({
  //   state: "",
  //   checkIn: "",
  //   checkOut: "",
  // });

  const dispatch = useDispatch();

  const query = useSelector((state) => state.houses.query);
  useEffect(() => {
    axios
      .get(BaseURL + GetUniqueStates)
      .then((response) => {
        if (typeof response.data === "object") {
          setUniqueStates(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      setUniqueStates([]);
    };
  }, []);

  useEffect(() => {
    if (!query.state && !moment(query.checkIn).isValid()) {
      setDisabled(true);
    }
    if (query.state && !moment(query.checkIn).isValid()) {
      setDisabled(false);
    }
    if (moment(query.checkIn).isValid() && !moment(query.checkOut).isValid()) {
      setDisabled(true);
    }
    if (
      query.state &&
      moment(query.checkIn).isValid() &&
      moment(query.checkOut).isValid()
    ) {
      setDisabled(false);
    }
  }, [disabled, query]);
  const getDisabledClear = useCallback(() => {
    if (!query.state && !moment(query.checkIn).isValid()) {
      return true;
    } else {
      return false;
    }
  }, [query]);

  return (
    <div className="flex bg-accent1 shadow-shadow2 rounded-xl whitespace-nowrap cursor-pointer border border-primary">
      {uniqueStates.length > 0 && (
        <>
          <Dropdown
            showClear
            className="flex justify-center items-center rounded-xl bg-accent1 text-accent2 hover:bg-secondary min-w-72 w-72 px-6 focus:shadow-none focus-visible:outline-none"
            // panelClassName="bg-accent1 text-accent2"
            value={query.state}
            options={
              Array.isArray(uniqueStates) &&
              uniqueStates?.map((state) => ({
                label: state,
                value: state,
              }))
            }
            placeholder="Select Destination"
            onChange={(e) =>
              dispatch(
                setQuery({
                  ...query,
                  state: e.value,
                  lat: "",
                  lng: "",
                  radius: 10,
                })
              )
            }
          />
          <Calendar
            inputClassName="placeholder:text-accent2 bg-accent1 flex justify-center rounded-xl hover:bg-secondary min-w-32 w-32 px-6 focus:shadow-none focus-visible:outline-none"
            placeholder="Check-In"
            value={query.checkIn}
            onChange={(e) =>
              dispatch(
                setQuery({
                  ...query,
                  checkIn: e.value,
                  lat: "",
                  lng: "",
                  radius: 10,
                })
              )
            }
            dateFormat="mm/dd/yy"
          />
          <Calendar
            inputClassName="placeholder:text-accent2 bg-accent1 flex justify-center rounded-xl hover:bg-secondary min-w-32 w-32 px-6 focus:shadow-none focus-visible:outline-none"
            placeholder="Check-Out"
            value={query.checkOut}
            minDate={
              query.checkIn
                ? new Date(
                    new Date(query.checkIn).setDate(
                      new Date(query.checkIn).getDate() + 1
                    )
                  )
                : null
            }
            onChange={(e) =>
              dispatch(
                setQuery({
                  ...query,
                  checkOut: e.value,
                  lat: "",
                  lng: "",
                  radius: 10,
                })
              )
            }
            dateFormat="mm/dd/yy"
          />
          <button
            className={`flex justify-center items-center rounded-xl ${
              disabled
                ? "bg-primary bg-opacity-80 cursor-not-allowed"
                : "bg-primary hover:bg-action"
            } text-accent1 min-w-20 w-20 py-2 px-6`}
            disabled={disabled}
            onClick={() => {
              dispatch(setIsDrag(false));
              dispatch(searchHousesByState());
            }}
          >
            Search
          </button>
          <button
            className={`flex justify-center items-center rounded-xl ${
              getDisabledClear()
                ? "bg-warning bg-opacity-80 cursor-not-allowed"
                : "bg-warning hover:bg-action"
            } text-accent1 min-w-20 w-20 py-2 px-6`}
            disabled={getDisabledClear()}
            onClick={() => {
              dispatch(clearFilter());
            }}
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
};

export default SearchBar;
