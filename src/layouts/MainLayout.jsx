import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatWidget from "../components/ChatWidget";

const links = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/places", label: "Điểm đến" },
  { to: "/foods", label: "Ăn gì" },
  { to: "/events", label: "Lễ hội" },
  { to: "/culture", label: "Văn hóa" },
  { to: "/ocop", label: "OCOP" },
  { to: "/map", label: "Bản đồ" },
  { to: "/info", label: "Thông tin" },
  { to: "/chat", label: "Hỏi AI" },
];

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <img src="/logo.svg" alt="" className="brand-logo" />
            <span>DakLak <span className="brand-accent">AI</span> Guide</span>
          </Link>

          <button
            className="menu-toggle"
            aria-label="Mở menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>

          <nav className={`nav ${open ? "nav-open" : ""}`}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to={isAuthenticated ? "/admin" : "/login"} className="nav-admin" onClick={() => setOpen(false)}>
              {isAuthenticated ? "Quản trị" : "Đăng nhập"}
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="brocade-band" aria-hidden="true" />
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">
              <img src="/logo.svg" alt="" />
              <span>DakLak <span className="brand-accent">AI</span> Guide</span>
            </div>
            <p>Trợ lý du lịch thông minh giúp bạn khám phá điểm đến, văn hóa Ê Đê, ẩm thực và đặc sản OCOP của Đắk Lắk.</p>
            <p className="footer-quote">“Đến Đắk Lắk, nghe cồng chiêng, uống ly cà phê.”</p>
          </div>
          <div>
            <h3>Khám phá</h3>
            <ul>
              <li><Link to="/places">Điểm đến</Link></li>
              <li><Link to="/foods">Ăn gì</Link></li>
              <li><Link to="/events">Lễ hội & sự kiện</Link></li>
              <li><Link to="/culture">Văn hóa</Link></li>
              <li><Link to="/ocop">Đặc sản OCOP</Link></li>
            </ul>
          </div>
          <div>
            <h3>Hỗ trợ du khách</h3>
            <ul>
              <li><Link to="/info">Thông tin cần thiết</Link></li>
              <li><Link to="/map">Bản đồ du lịch</Link></li>
              <li><Link to="/chat">Hỏi trợ lý AI</Link></li>
              <li><a href="tel:115">Cấp cứu: 115</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">© {new Date().getFullYear()} DakLak AI Guide · Du lịch, văn hóa và đặc sản OCOP tỉnh Đắk Lắk</div>
        </div>
      </footer>

      {location.pathname !== "/chat" && <ChatWidget />}
    </div>
  );
}
