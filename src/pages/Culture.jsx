import cultureApi from "../api/cultureApi";
import CatalogList from "./CatalogList";
import ItemCard from "../components/ItemCard";

const fetcher = () => cultureApi.getAll();
const searchFields = (a) => [a.title, a.content];

export default function Culture() {
  return (
    <CatalogList
      title="Văn hóa Đắk Lắk"
      subtitle="Lễ hội, cồng chiêng, nhà dài, ẩm thực và đời sống các dân tộc Tây Nguyên"
      fetcher={fetcher}
      searchFields={searchFields}
      renderItem={(a) => (
        <ItemCard key={a.articleId} to={`/culture/${a.articleId}`} image={a.imageUrl} icon="🥁" title={a.title} text={a.content}>
          {a.category?.categoryName && <span className="badge">{a.category.categoryName}</span>}
        </ItemCard>
      )}
    />
  );
}
