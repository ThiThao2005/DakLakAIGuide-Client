import ocopApi from "../api/ocopApi";
import CatalogList from "./CatalogList";
import ItemCard from "../components/ItemCard";
import { formatPrice, stars } from "../utils/format";

const fetcher = () => ocopApi.getAll();
const searchFields = (p) => [p.name, p.description, p.producer, p.address];
const starFilter = {
  label: "Tất cả hạng sao",
  options: [5, 4, 3].map((n) => ({ value: String(n), label: `${n} sao` })),
  test: (p, v) => String(p.ocopLevel) === v,
};

export default function OcopProducts() {
  return (
    <CatalogList
      title="Sản phẩm OCOP Đắk Lắk"
      subtitle="Cà phê, ca cao, mật ong, hồ tiêu và các đặc sản đạt chuẩn OCOP"
      fetcher={fetcher}
      searchFields={searchFields}
      extraFilter={starFilter}
      renderItem={(p) => (
        <ItemCard key={p.productId} to={`/ocop/${p.productId}`} image={p.imageUrl} icon="☕" title={p.name} text={p.description}>
          {p.ocopLevel && <span className="badge badge-accent stars">{stars(p.ocopLevel)}</span>}
          {formatPrice(p.price) && <span className="badge badge-green">{formatPrice(p.price)}</span>}
          {p.category?.categoryName && <span className="badge">{p.category.categoryName}</span>}
        </ItemCard>
      )}
    />
  );
}
