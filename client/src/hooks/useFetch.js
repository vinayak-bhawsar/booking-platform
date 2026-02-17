import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://booking-platform-w5pg.onrender.com/api";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(BASE_URL + url);
        setData(res.data);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;