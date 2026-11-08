import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axiosClient";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/admin";
  if (isAuthenticated) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Đăng nhập thất bại"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="login-box" onSubmit={submit}>
        <h1 style={{ fontSize: "1.5rem" }}>Đăng nhập quản trị</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="field">
          <label htmlFor="u">Tên đăng nhập</label>
          <input id="u" className="input" autoComplete="username" required value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="p">Mật khẩu</label>
          <input id="p" type="password" className="input" autoComplete="current-password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
