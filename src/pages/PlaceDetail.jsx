import placeApi from "../api/placeApi";
import DetailView from "./DetailView";
import { formatPrice, openStatus } from "../utils/format";

function OpeningBanner({ place }) {
  const status = openStatus(place.openTime, place.closeTime);
  if (!status) return null;
  return (
    <div className={`dv-status ${status.open ? "is-open" : "is-closed"}`}>
      <span className="dv-status-dot" aria-hidden="true" />
      <strong>{status.label}</strong>
      <span>· Giờ mở cửa {place.openTime} – {place.closeTime} (theo giờ trên máy bạn)</span>
    </div>
  );
}

export default function PlaceDetail() {
  return (
    <DetailView
      fetcher={(id) => placeApi.getById(id)}
      listFetcher={() => placeApi.getAll()}
      idKey="placeId"
      toPath={(p) => `/places/${p.placeId}`}
      backTo="/places"
      backLabel="Điểm đến"
      sectionLabel="Điểm đến Đắk Lắk"
      icon="🏞️"
      mapColor="#2f5d3a"
      getTitle={(p) => p.name}
      getText={(p) => p.description}
      getSubtitle={(p) => p.address}
      badges={(p) => (
        <>
          {p.category?.categoryName && <span className="badge">{p.category.categoryName}</span>}
          {p.isFeatured && <span className="badge badge-accent">⭐ Nổi bật</span>}
        </>
      )}
      highlight={(p) => <OpeningBanner place={p} />}
      facts={(p) => [
        { icon: "🎟️", label: "Giá vé", value: formatPrice(p.ticketPrice) },
        { icon: "🕒", label: "Giờ mở cửa", value: p.openTime && `${p.openTime}${p.closeTime ? ` – ${p.closeTime}` : ""}` },
        { icon: "🏷️", label: "Loại hình", value: p.category?.categoryName },
        { icon: "📍", label: "Địa chỉ", value: p.address, copy: true },
      ]}
      related={(p, list) => {
        const same = list.filter((x) => x.categoryId && x.categoryId === p.categoryId);
        return [...same, ...list.filter((x) => !same.includes(x) && x.isFeatured)];
      }}
      relatedTitle="Điểm đến tương tự"
      aiQuestion={(p) => `Gợi ý cho tôi cách đi và nên làm gì khi đến ${p.name}`}
    />
  );
}
