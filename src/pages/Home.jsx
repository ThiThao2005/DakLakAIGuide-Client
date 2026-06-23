import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>DakLak AI Guide</h1>
      <p>Trợ lý du lịch, văn hóa và đặc sản OCOP thông minh tỉnh Đắk Lắk</p>

      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/places">Địa điểm</Link>
        <Link to="/ocop">OCOP</Link>
        <Link to="/culture">Văn hóa</Link>
      </nav>
    </div>
  );
}