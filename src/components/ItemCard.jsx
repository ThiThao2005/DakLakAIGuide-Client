import { Link } from "react-router-dom";
import { safeUrl } from "../utils/format";

export default function ItemCard({ to, image, icon = "🌿", title, text, children }) {
  const img = safeUrl(image);
  return (
    <Link to={to} className="card">
      {img ? (
        <img src={img} alt={title} className="card-img" loading="lazy" />
      ) : (
        <div className="card-img-empty">{icon}</div>
      )}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {text && <p className="card-text">{text}</p>}
        {children && <div className="card-meta">{children}</div>}
      </div>
    </Link>
  );
}
