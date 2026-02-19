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

  // ✅ FIXED DEFAULT VALUES
  const minParam = queryParams.get("min") || 1;
  const maxParam = queryParams.get("max") || 999999;

  const [min, setMin] = useState(minParam);
  const [max, setMax] = useState(maxParam);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  // ✅ FINAL API URL
  const apiUrl =
    type === "cars"
      ? `/cars`
      : type === "flights"
      ? `/flights`
      : `/hotels?type=${selectedType}&min=${min}&max=${max}&sort=${sort}&page=${page}&pageSize=5`;

  const { data, loading, error } = useFetch(apiUrl);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [sort, min, max, selectedType]);

  const handleFilter = () => {
    navigate(
      `/hotels?type=${selectedType}&min=${min}&max=${max}`
    );
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />

      <div className="listContainer">
        <div className="listWrapper">

          {/* LEFT FILTER PANEL */}
          <div className="listSearch">
            <h1 className="lsTitle">
              {selectedType ? selectedType.toUpperCase() : "Search"}
            </h1>

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

                {/* Pagination */}
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