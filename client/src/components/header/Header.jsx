import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useContext, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

const Header = ({ type }) => {
 // const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(SearchContext);
  console.log("Selected category:", category);

  // 🔥 NEW CATEGORY STATE
  const [category, setCategory] = useState("stays");

  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const handleOption = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]:
        operation === "i" ? prev[name] + 1 : prev[name] - 1,
    }));
  };

  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { destination, dates, options, category },
    });

    navigate("/hotels", {
      state: { destination, dates, options, category },
    });
  };

  const categories = [
    { name: "stays", icon: faBed, label: "Stays" },
    { name: "flights", icon: faPlane, label: "Flights" },
    { name: "cars", icon: faCar, label: "Car rentals" },
    { name: "attractions", icon: faBed, label: "Attractions" },
    { name: "taxis", icon: faTaxi, label: "Airport taxis" },
  ];

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        {/* 🔥 Dynamic Category Section */}
        <div className="headerList">
          {categories.map((item) => (
            <div
              key={item.name}
              className={
                category === item.name
                  ? "headerListItem active"
                  : "headerListItem"
              }
              onClick={() => setCategory(item.name)}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              A lifetime of discounts? It's Genius.
            </h1>
            <p className="headerDesc">
              Get rewarded for your travels – unlock instant savings of 10% or
              more with a free Lamabooking account
            </p>

            {!user && (
              <button
                className="headerBtn"
               // onClick={() => navigate("/login")}
              >
                Sign in / Register
              </button>
            )}

            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="headerSearchItem">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="headerIcon"
                />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >
                  {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                    dates[0].endDate,
                    "MM/dd/yyyy"
                  )}`}
                </span>

                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) =>
                      setDates([item.selection])
                    }
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>

              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >
                  {`${options.adult} adult · ${options.children} children · ${options.room} room`}
                </span>

                {openOptions && (
                  <div className="options">
                    {["adult", "children", "room"].map((type) => (
                      <div className="optionItem" key={type}>
                        <span className="optionText">
                          {type.charAt(0).toUpperCase() +
                            type.slice(1)}
                        </span>
                        <div className="optionCounter">
                          <button
                            disabled={options[type] <= (type === "children" ? 0 : 1)}
                            className="optionCounterButton"
                            onClick={() =>
                              handleOption(type, "d")
                            }
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">
                            {options[type]}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() =>
                              handleOption(type, "i")
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="headerSearchItem">
                <button
                  className="headerBtn"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;