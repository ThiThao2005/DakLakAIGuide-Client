import { useMemo, useState } from "react";
import placeApi from "../api/placeApi";
import ocopApi from "../api/ocopApi";
import useFetch from "../hooks/useFetch";
import MapView from "../components/MapView";
import { ErrorState, Loading } from "../components/StateView";
import { formatPrice, hasCoords } from "../utils/format";

const COLORS = { places: "#2f6b3a", ocop: "#d97a2b" };

export default function MapPage() {
  const places = useFetch(() => placeApi.getAll(), []);
  const products = useFetch(() => ocopApi.getAll(), []);
  const [show, setShow] = useState({ places: true, ocop: true });

  const markers = useMemo(() => {
    const list = [];
    if (show.places)
      (places.data || []).filter(hasCoords).forEach((p) =>
        list.push({
          id: `p${p.placeId}`,
          lat: p.latitude,
          lng: p.longitude,
          title: p.name,
          subtitle: p.address,
          to: `/places/${p.placeId}`,
          color: COLORS.places,
        })
      );
    if (show.ocop)
      (products.data || []).filter(hasCoords).forEach((p) =>
        list.push({
          id: `o${p.productId}`,
          lat: p.latitude,
          lng: p.longitude,
          title: p.name,
          subtitle: [p.producer, formatPrice(p.price)].filter(Boolean).join(" · "),
          to: `/ocop/${p.productId}`,
          color: COLORS.ocop,
        })
      );
    return list;
  }, [places.data, products.data, show]);

  const loading = places.loading || products.loading;
  const error = places.error || products.error;

  return (
    <div className="container">
      <h1 className="page-title">Bản đồ du lịch Đắk Lắk</h1>
      <p className="page-sub">Các địa điểm du lịch và cơ sở sản xuất OCOP trên bản đồ</p>

      <div className="toolbar">
        <label className="check">
          <input type="checkbox" checked={show.places} onChange={(e) => setShow((s) => ({ ...s, places: e.target.checked }))} />
          <span className="legend-dot" style={{ background: COLORS.places }} /> Địa điểm du lịch
        </label>
        <label className="check">
          <input type="checkbox" checked={show.ocop} onChange={(e) => setShow((s) => ({ ...s, ocop: e.target.checked }))} />
          <span className="legend-dot" style={{ background: COLORS.ocop }} /> Sản phẩm OCOP
        </label>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { places.reload(); products.reload(); }} />
      ) : (
        <>
          <MapView markers={markers} />
          <p className="map-legend">{markers.length} điểm có tọa độ trên bản đồ</p>
        </>
      )}
    </div>
  );
}
