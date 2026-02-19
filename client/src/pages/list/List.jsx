import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = ({ type }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedType = queryParams.get("type") || "";
  const minParam = queryParams.get("min")
    ? Number(queryParams.get("min"))
    : 1;
  const maxParam = queryParams.get("max")
    ? Number(queryParams.get("max"))
    : 999999;

  const [min, setMin] = useState(minParam);
  const [max, setMax] = useState(maxParam);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const apiUrl =
    type === "stays"
      ? `/hotels?type=${selectedType}&min=${min}&max=${max}&sort=${sort}&page=${page}&pageSize=5`
      : null;

  const { data, loading, error } = useFetch(apiUrl);

  useEffect(() => {
    setPage(1);
  }, [sort, min, max, selectedType]);

  const handleFilter = () => {
    navigate(
      `/${type}?type=${selectedType}&min=${min}&max=${max}`
    );
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />

      <div className="listContainer">
        <div className="listWrapper">

          {/* FILTER ONLY FOR STAYS */}
          {type === "stays" && (
            <div className="listSearch">
              <h1 className="lsTitle">
                {selectedType
                  ? selectedType.toUpperCase()
                  : "Search"}
              </h1>

              <div className="lsItem">
                <label>Min price</label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) =>
                    setMin(Number(e.target.value))
                  }
                />
              </div>

              <div className="lsItem">
                <label>Max price</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) =>
                    setMax(Number(e.target.value))
                  }
                />
              </div>

              <button onClick={handleFilter}>
                Apply Filter
              </button>
            </div>
          )}

          <div className="listResult">

            {/* STAYS */}
            {type === "stays" &&
              (loading ? (
                "Loading..."
              ) : error ? (
                "Something went wrong"
              ) : data?.hotels?.length > 0 ? (
                <>
                  {data.hotels.map((item) => (
                    <SearchItem
                      item={item}
                      key={item._id}
                    />
                  ))}
                </>
              ) : (
                <h2>No Hotels Found</h2>
              ))}

            {/* FLIGHTS */}
            {type === "flights" && (
              <>
                <div className="card">
                  <h3>Indore → Mumbai</h3>
                  <p>IndiGo • 2h 10m</p>
                  <p>₹ 4,500</p>
                </div>

                <div className="card">
                  <h3>Delhi → Bangalore</h3>
                  <p>Air India • 2h 40m</p>
                  <p>₹ 6,200</p>
                </div>
              </>
            )}

            {/* CARS */}
            {type === "cars" && (
              <>
                <div className="card">
                  <h3>Swift Dzire</h3>
                  <p>Manual • 5 Seats</p>
                  <p>₹ 1,200/day</p>
                </div>

                <div className="card">
                  <h3>Hyundai Creta</h3>
                  <p>Automatic • 5 Seats</p>
                  <p>₹ 2,200/day</p>
                </div>
              </>
            )}

            {/* ATTRACTIONS */}
            {type === "attractions" && (
              <>
                <div className="card">
                  <h3>Taj Mahal</h3>
                  <p>Agra • ₹ 1,000 Entry</p>
                </div>

                <div className="card">
                  <h3>Jaipur City Tour</h3>
                  <p>Full Day • ₹ 2,500</p>
                </div>
              </>
            )}

            {/* TAXIS */}
            {type === "taxis" && (
              <>
                <div className="card">
                  <h3>Airport → City</h3>
                  <p>Sedan • ₹ 900</p>
                </div>

                <div className="card">
                  <h3>Airport → Hotel</h3>
                  <p>SUV • ₹ 1,400</p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default List;