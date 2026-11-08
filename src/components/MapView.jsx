import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { hasCoords } from "../utils/format";

// Trung tâm TP. Buôn Ma Thuột
export const DAKLAK_CENTER = [12.6667, 108.0383];

const iconCache = {};
function pinIcon(color) {
  if (!iconCache[color]) {
    iconCache[color] = L.divIcon({
      className: "",
      html: `<div class="marker-pin" style="background:${color}"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24],
    });
  }
  return iconCache[color];
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 14);
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);
  return null;
}

/**
 * markers: [{ id, lat, lng, title, subtitle, to, color }]
 */
export default function MapView({ markers = [], small = false }) {
  const valid = markers.filter((m) => hasCoords({ latitude: m.lat, longitude: m.lng }));
  const points = valid.map((m) => [Number(m.lat), Number(m.lng)]);

  return (
    <MapContainer center={DAKLAK_CENTER} zoom={10} scrollWheelZoom={false} className={`map ${small ? "map-sm" : ""}`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {valid.map((m) => (
        <Marker key={m.id} position={[Number(m.lat), Number(m.lng)]} icon={pinIcon(m.color || "#d97a2b")}>
          <Popup>
            <div className="popup-title">{m.title}</div>
            {m.subtitle && <div>{m.subtitle}</div>}
            {m.to && <Link to={m.to}>Xem chi tiết →</Link>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
