import { useEffect, useState } from "react";
import ocopApi from "../api/ocopApi";

export default function OcopProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ocopApi.getAll().then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1>Sản phẩm OCOP Đắk Lắk</h1>

      {products.map((p) => (
        <div key={p.productId} style={{ border: "1px solid #ddd", margin: 12, padding: 12 }}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>Nhà sản xuất: {p.producer}</p>
          <p>OCOP: {p.ocopLevel} sao</p>
          <p>Giá: {p.price?.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
}