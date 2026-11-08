import foodApi from "../api/foodApi";
import DetailView from "./DetailView";
import ItemCard from "../components/ItemCard";

export default function FoodDetail() {
  return (
    <DetailView
      fetcher={(id) => foodApi.getById(id)}
      listFetcher={() => foodApi.getAll()}
      idKey="foodId"
      toPath={(f) => `/foods/${f.foodId}`}
      backTo="/foods"
      backLabel="Ăn gì"
      sectionLabel="Ẩm thực Đắk Lắk"
      icon="🍲"
      mapColor="#b25a33"
      getTitle={(f) => f.name}
      getText={(f) => f.description}
      getSubtitle={(f) => f.address}
      badges={(f) => (
        <>
          {f.foodType && <span className="badge">{f.foodType}</span>}
          {f.isFeatured && <span className="badge badge-accent">⭐ Phải thử</span>}
        </>
      )}
      highlight={(f) =>
        f.whereToEat ? (
          <section className="dv-card dv-tip">
            <h2 className="dv-h2">🍽️ Ăn ở đâu ngon?</h2>
            <p style={{ whiteSpace: "pre-line", margin: 0 }}>{f.whereToEat}</p>
          </section>
        ) : null
      }
      facts={(f) => [
        { icon: "🏷️", label: "Loại món", value: f.foodType },
        { icon: "💰", label: "Giá tham khảo", value: f.priceRange },
        { icon: "📍", label: "Quán tiêu biểu", value: f.address, copy: true },
      ]}
      related={(f, list) => {
        const same = list.filter((x) => x.foodType && x.foodType === f.foodType);
        return [...same, ...list.filter((x) => !same.includes(x))];
      }}
      relatedTitle="Món ngon khác"
      renderRelated={(x) => (
        <ItemCard key={x.foodId} to={`/foods/${x.foodId}`} image={x.imageUrl} icon="🍲" title={x.name} text={x.description}>
          {x.foodType && <span className="badge">{x.foodType}</span>}
        </ItemCard>
      )}
      aiQuestion={(f) => `Nên ăn ${f.name} ở đâu ngon tại Đắk Lắk, giá khoảng bao nhiêu?`}
    />
  );
}
