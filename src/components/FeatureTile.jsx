import { Link } from "react-router-dom";
import { safeUrl } from "../utils/format";

// Thẻ ảnh lớn có chữ đè lên ảnh (dùng cho "Cẩm nang" và "Điểm đến lý thú")
export default function FeatureTile({ to, image, icon, title, text, tall = false, tint = "#6b3e26" }) {
  const img = safeUrl(image);
  const style = img
    ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.75) 100%), url("${img}")` }
    : { backgroundImage: `linear-gradient(160deg, ${tint}cc 0%, ${tint} 100%)` };

  return (
    <Link to={to} className={`tile ${tall ? "tile-tall" : ""}`} style={style}>
      {!img && icon && <span className="tile-icon" aria-hidden="true">{icon}</span>}
      <div className="tile-body">
        <h3 className="tile-title">{title}</h3>
        {text && <p className="tile-text">{text}</p>}
      </div>
      <span className="tile-arrow" aria-hidden="true">›</span>
    </Link>
  );
}
