import cultureApi from "../api/cultureApi";
import DetailView from "./DetailView";
import ItemCard from "../components/ItemCard";

function readingMinutes(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function CultureDetail() {
  return (
    <DetailView
      fetcher={(id) => cultureApi.getById(id)}
      listFetcher={() => cultureApi.getAll()}
      idKey="articleId"
      toPath={(a) => `/culture/${a.articleId}`}
      backTo="/culture"
      backLabel="Văn hóa"
      sectionLabel="Văn hóa Tây Nguyên"
      icon="🥁"
      getTitle={(a) => a.title}
      getText={(a) => a.content}
      badges={(a) => (
        <>
          {a.category?.categoryName && <span className="badge">{a.category.categoryName}</span>}
          <span className="badge">⏱️ {readingMinutes(a.content)} phút đọc</span>
        </>
      )}
      facts={(a) => [
        { icon: "🏷️", label: "Chủ đề", value: a.category?.categoryName },
        { icon: "🗓️", label: "Ngày đăng", value: a.createdAt && new Date(a.createdAt).toLocaleDateString("vi-VN") },
        { icon: "⏱️", label: "Thời gian đọc", value: `${readingMinutes(a.content)} phút` },
      ]}
      related={(a, list) => {
        const same = list.filter((x) => x.categoryId && x.categoryId === a.categoryId);
        return [...same, ...list.filter((x) => !same.includes(x))];
      }}
      relatedTitle="Bài viết liên quan"
      renderRelated={(x) => (
        <ItemCard key={x.articleId} to={`/culture/${x.articleId}`} image={x.imageUrl} icon="🥁" title={x.title} text={x.content}>
          {x.category?.categoryName && <span className="badge">{x.category.categoryName}</span>}
        </ItemCard>
      )}
      aiQuestion={(a) => `Giải thích thêm cho tôi về ${a.title}, du khách có thể trải nghiệm ở đâu?`}
    />
  );
}
