import placeApi from "../api/placeApi";
import CatalogList from "./CatalogList";
import ItemCard from "../components/ItemCard";
import { formatPrice } from "../utils/format";

const fetcher = () => placeApi.getAll();
const searchFields = (p) => [p.name, p.description, p.address];

export default function Places() {
  return (
    <CatalogList
      title="Địa điểm du lịch Đắk Lắk"
      subtitle="Thác nước, hồ, buôn làng, bảo tàng và nhiều điểm đến hấp dẫn"
      fetcher={fetcher}
      searchFields={searchFields}
      renderItem={(p) => (
        <ItemCard key={p.placeId} to={`/places/${p.placeId}`} image={p.imageUrl} icon="🏞️" title={p.name} text={p.description}>
          {p.category?.categoryName && <span className="badge">{p.category.categoryName}</span>}
          {p.isFeatured && <span className="badge badge-accent">Nổi bật</span>}
          {formatPrice(p.ticketPrice) && <span className="badge badge-green">🎟️ {formatPrice(p.ticketPrice)}</span>}
        </ItemCard>
      )}
    />
  );
}
