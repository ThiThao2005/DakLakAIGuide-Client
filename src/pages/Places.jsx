import { useEffect, useState } from "react";
import placeApi from "../api/placeApi";

export default function Places() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    placeApi.getAll().then((res) => setPlaces(res.data));
  }, []);

  return (
    <div>
      <h1>Địa điểm du lịch Đắk Lắk</h1>

      {places.map((p) => (
        <div key={p.placeId} style={{ border: "1px solid #ddd", margin: 12, padding: 12 }}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>Địa chỉ: {p.address}</p>
          <p>Loại: {p.category?.categoryName}</p>
          <p>Giá vé: {p.ticketPrice?.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
}