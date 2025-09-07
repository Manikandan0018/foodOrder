import { useEffect, useState } from "react";
import axios from "axios";

const NearByHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(
            `http://localhost:5000/api/restaurants/nearby?lat=${latitude}&lng=${longitude}`
          );
          setHotels(res.data);
        } catch (err) {
          console.error(err);
          setError("Error fetching hotels");
        }
      },
      (err) => {
        setError("Geolocation not allowed");
      }
    );
  }, []);

  return (
    <div>
      <h2>Nearby Hotels</h2>
      {error && <p>{error}</p>}
      {hotels.length > 0 ? (
        hotels.map((h) => (
          <div key={h._id}>
            <h3>{h.name}</h3>
            <p>{h.address}</p>
            <img src={h.imageUrl} alt={h.name} width="200" />
          </div>
        ))
      ) : (
        <p>No hotels found</p>
      )}
    </div>
  );
};

export default NearByHotel;
