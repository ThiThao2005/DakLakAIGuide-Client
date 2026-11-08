import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container state">
      <h1>404</h1>
      <p>Không tìm thấy trang bạn yêu cầu.</p>
      <Link to="/" className="btn">Về trang chủ</Link>
    </div>
  );
}
