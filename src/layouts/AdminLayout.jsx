import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resources } from "../pages/admin/resources";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <Link to="/" className="brand brand-light">
          <img src="/logo.svg" alt="" className="brand-logo" />
          <span>DakLak Admin</span>
        </Link>
        <nav className="admin-nav">
          <NavLink to="/admin" end>📊 Tổng quan</NavLink>
          {Object.entries(resources).map(([key, r]) => (
            <NavLink key={key} to={`/admin/${key}`}>
              {r.icon} {r.title}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <span>👤 {user?.username}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
