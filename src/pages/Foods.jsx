import foodApi from "../api/foodApi";
import CatalogList from "./CatalogList";
import ItemCard from "../components/ItemCard";

const fetcher = () => foodApi.getAll();
const searchFields = (f) => [f.name, f.description, f.whereToEat, f.address];
const typeOf = (f) => f.foodType;

export default function Foods() {
  return (
    <CatalogList
      title="Ăn gì ở Đắk Lắk"
      subtitle="Cơm lam, gà nướng, bún đỏ, rượu cần và những hương vị núi rừng Tây Nguyên"
      fetcher={fetcher}
      searchFields={searchFields}
      categoryOf={typeOf}
      categoryLabel="Tất cả loại món"
      renderItem={(f) => (
        <ItemCard key={f.foodId} to={`/foods/${f.foodId}`} image={f.imageUrl} icon="🍲" title={f.name} text={f.description}>
          {f.foodType && <span className="badge">{f.foodType}</span>}
          {f.isFeatured && <span className="badge badge-accent">Phải thử</span>}
          {f.priceRange && <span className="badge badge-green">{f.priceRange}</span>}
        </ItemCard>
      )}
    />
  );
}
