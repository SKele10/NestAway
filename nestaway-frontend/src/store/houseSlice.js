import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { GetHouses, HostURL } from "../api";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;
const initialState = {
  houseData: [],
  query: {
    state: "",
    checkIn: "",
    checkOut: "",
    lat: "",
    lng: "",
    radius: 10,
  },
  isDrag: true,
  isLoading: false,
  isError: false,
  mapCenter: null,
};

export const houseSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setIsDrag: (state, action) => {
      state.isDrag = action.payload;
    },
    clearFilter: (state) => {
      state.query = {
        state: "",
        checkIn: "",
        checkOut: "",
        lat: "",
        lng: "",
        radius: 10,
      };
    },
    setMapCenter: (state, action) => {
      state.mapCenter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHouses.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchHouses.fulfilled, (state, action) => {
      state.isLoading = false;
      state.houseData = action.payload;
    });
    builder.addCase(fetchHouses.rejected, (state, action) => {
      state.isError = true;
    });
    builder.addCase(searchHousesByState.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(searchHousesByState.fulfilled, (state, action) => {
      state.isLoading = false;
      state.houseData = action.payload;
    });
    builder.addCase(searchHousesByState.rejected, (state, action) => {
      state.isError = true;
    });
  },
});

export const { setQuery, setMapCenter, setIsDrag, clearFilter } =
  houseSlice.actions;

export const fetchHouses = createAsyncThunk(
  "fetchHouses",
  async (_, { getState }) => {
    let houseData = [],
      headers = {};
    const { query } = getState().houses;
    const { currentUser } = getState().auth;
    if (currentUser) {
      headers = {
        Authorization: `Bearer ${currentUser.accessToken}`,
      };
    }
    await axios
      .post(BaseURL + GetHouses, query, { headers })
      .then((response) => {
        houseData = response.data;
      })
      .catch((error) => {
        console.error("Error fetching houses:", error);
      });
    return houseData;
  }
);

export const searchHousesByState = createAsyncThunk(
  "searchHousesByState",
  async (_, { getState }) => {
    let houseData = [],
      headers = {};
    const { query } = getState().houses;
    const { currentUser } = getState().auth;
    if (currentUser) {
      headers = {
        Authorization: `Bearer ${currentUser.accessToken}`,
      };
    }
    await axios
      .post(BaseURL + GetHouses, query, { headers })
      .then((response) => {
        houseData = response.data;
      })
      .catch((error) => {
        console.error("Error fetching houses:", error);
        return [];
      });
    return houseData;
  }
);

export default houseSlice.reducer;
