import { useEffect, useState } from "react";
import cultureApi from "../api/cultureApi";

export default function Culture() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    cultureApi.getAll().then((res) => setArticles(res.data));
  }, []);

  return (
    <div>
      <h1>Văn hóa Đắk Lắk</h1>

      {articles.map((a) => (
        <div key={a.articleId} style={{ border: "1px solid #ddd", margin: 12, padding: 12 }}>
          <h3>{a.title}</h3>
          <p>{a.content}</p>
          <p>Chủ đề: {a.category?.categoryName}</p>
        </div>
      ))}
    </div>
  );
}