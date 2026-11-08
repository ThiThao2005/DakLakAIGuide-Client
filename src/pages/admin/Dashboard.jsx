import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { resources } from "./resources";
import { useAuth } from "../../context/AuthContext";

function StatCard({ to, resource }) {
  const { data, loading, error } = useFetch(() => resource.api.getAll(), [resource]);
  return (
    <Link to={to} className="stat">
      <div className="stat-num">{loading ? "…" : error ? "!" : data?.length ?? 0}</div>
      <div className="stat-label">{resource.icon} {resource.title}</div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="page-title">Xin chào, {user?.username} 👋</h1>
      <p className="page-sub">Quản lý nội dung hiển thị trên website DakLak AI Guide.</p>

      <div className="stats">
        {Object.entries(resources).map(([key, r]) => (
          <StatCard key={key} to={`/admin/${key}`} resource={r} />
        ))}
      </div>

      <div className="detail-info">
        <h3>Gợi ý</h3>
        <ul>
          <li>Nhập <b>vĩ độ / kinh độ</b> để địa điểm và sản phẩm hiện trên bản đồ (lấy từ Google Maps: chuột phải → copy tọa độ).</li>
          <li>Thông tin bạn nhập càng đầy đủ (mô tả, giá, giờ mở cửa) thì chatbot AI trả lời càng chính xác.</li>
          <li>Đánh dấu <b>Nổi bật</b> để địa điểm được ưu tiên hiển thị trên trang chủ.</li>
        </ul>
      </div>
    </div>
  );
}
