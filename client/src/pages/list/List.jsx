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

  const city = queryParams.get("city") || "";
  const minParam = queryParams.get("min") || 0;
  const maxParam = queryParams.get("max") || 999;

  const [min, setMin] = useState(minParam);
  const [max, setMax] = useState(maxParam);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  // 🔥 Dynamic API with sorting + pagination
  const apiUrl =
    type === "cars"
      ? `/cars`
      : type === "flights"
      ? `/flights`
      : `/hotels?city=${city}&min=${min}&max=${max}&sort=${sort}&page=${page}&pageSize=5`;

  const { data, loading, error } = useFetch(apiUrl);

  // 🔥 Reset page when filter or sort changes
  useEffect(() => {
    setPage(1);
  }, [sort, min, max]);

  const handleFilter = () => {
    navigate(`/hotels?city=${city}&min=${min}&max=${max}`);
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />

      <div className="listContainer">
        <div className="listWrapper">

          {/* LEFT SEARCH PANEL */}
          <div className="listSearch">
            <h1 className="lsTitle">
              {type ? type.toUpperCase() : "Search"}
            </h1>

            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={city} type="text" />
            </div>

            <div className="lsItem">
              <label>Min price</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            </div>

            <div className="lsItem">
              <label>Max price</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>

            <div className="lsItem">
              <label>Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="price_asc">Price Low → High</option>
                <option value="price_desc">Price High → Low</option>
                <option value="rating">Rating High</option>
              </select>
            </div>

            <button onClick={handleFilter}>
              Apply Filter
            </button>
          </div>

          {/* RIGHT RESULT PANEL */}
          <div className="listResult">
            {loading ? (
              "Loading..."
            ) : error ? (
              "Something went wrong"
            ) : data?.hotels?.length > 0 ? (
              <>
                {data.hotels.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}

                {/* 🔥 Pagination Buttons */}
                <div style={{ marginTop: "20px" }}>
                  {Array.from(
                    { length: data.totalPages || 1 },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        style={{
                          margin: "5px",
                          padding: "8px 12px",
                          background:
                            page === i + 1 ? "black" : "white",
                          color:
                            page === i + 1 ? "white" : "black",
                          border: "1px solid black",
                          cursor: "pointer"
                        }}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              </>
            ) : (
              <h2>No Data Found</h2>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default List;