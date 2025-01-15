import home from "/houseTypes/home.png";
import apartment from "/houseTypes/apartment.png";
import condo from "/houseTypes/condo.png";
import duplex from "/houseTypes/duplex.png";
import mobile from "/houseTypes/mobile.png";
import cabin from "/houseTypes/cabin.png";
import loft from "/houseTypes/loft.png";
import townhouse from "/houseTypes/residence.png";
import studio from "/houseTypes/studio.png";
import others from "/houseTypes/jungle.png";

export const navigation = [
  {
    id: 0,
    title: "Launches",
    url: "/launches/page/0",
    name: "launches",
  },
  {
    id: 1,
    title: "Payloads",
    url: "/payloads/page/0",
    name: "payloads",
  },
  {
    id: 2,
    title: "Cores",
    url: "/cores/page/0",
    name: "cores",
  },
  {
    id: 3,
    title: "Rockets",
    url: "/rockets/page/0",
    name: "rockets",
  },
  {
    id: 4,
    title: "Ships",
    url: "/ships/page/0",
    name: "ships",
  },
  {
    id: 5,
    title: "Launch Pads",
    url: "/launchpads/page/0",
    name: "launchpads",
  },
];

export const initialFeatures = {
  maxGuests: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 1,
};

export const initialAmenities = {
  wifi: true,
  tv: true,
  ac: true,
  kitchen: true,
  parking: true,
  pool: false,
  gym: false,
  hotTub: false,
  fireplace: false,
  washer: true,
  dryer: true,
  heating: true,
  smokeDetector: true,
  carbonMonoxideDetector: true,
  firstAidKit: true,
  fireExtinguisher: true,
};

export const initialDetails = {
  title: "The Best Nest",
  description: "Amazing place to stay in",
  price: 100,
};
export const initialPolicies = {
  cancellationDays: 7,
  cancellationPercent: 50,
  changeDays: 7,
};

export const initialRules = {
  checkIn: 15,
  checkOut: 11,
  smoking: false,
  pets: false,
};
export const validHouseTypes = [
  "Home",
  "Apartment",
  "Condo",
  "Townhouse",
  "Duplex",
  "Mobile Home",
  "Cabin",
  "Loft",
  "Studio",
  "Others",
];

export const houseTypes = [
  {
    type: "Home",
    icon: home,
  },
  {
    type: "Apartment",
    icon: apartment,
  },
  {
    type: "Condo",
    icon: condo,
  },
  {
    type: "Townhouse",
    icon: townhouse,
  },
  {
    type: "Duplex",
    icon: duplex,
  },
  {
    type: "Mobile Home",
    icon: mobile,
  },
  {
    type: "Cabin",
    icon: cabin,
  },
  {
    type: "Loft",
    icon: loft,
  },
  {
    type: "Studio",
    icon: studio,
  },
  {
    type: "Others",
    icon: others,
  },
];
