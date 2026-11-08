import ocopApi from "../api/ocopApi";
import DetailView from "./DetailView";
import ItemCard from "../components/ItemCard";
import { formatPrice, stars } from "../utils/format";

function OcopBanner({ product: p }) {
  if (!p.ocopLevel) return null;
  return (
    <div className="dv-ocop">
      <div className="dv-ocop-stars" aria-label={`${p.ocopLevel} sao OCOP`}>{stars(p.ocopLevel)}</div>
      <div>
        <strong>Sản phẩm OCOP {p.ocopLevel} sao</strong>
        <p>Sản phẩm đạt chuẩn chương trình Mỗi xã một sản phẩm (OCOP), đã được đánh giá về chất lượng, nguồn gốc và khả năng phát triển thị trường.</p>
      </div>
    </div>
  );
}

export default function OcopDetail() {
  return (
    <DetailView
      fetcher={(id) => ocopApi.getById(id)}
      listFetcher={() => ocopApi.getAll()}
      idKey="productId"
      toPath={(p) => `/ocop/${p.productId}`}
      backTo="/ocop"
      backLabel="Đặc sản OCOP"
      sectionLabel="Đặc sản OCOP Đắk Lắk"
      icon="☕"
      mapColor="#b25a33"
      getTitle={(p) => p.name}
      getText={(p) => p.description}
      getSubtitle={(p) => p.address}
      badges={(p) => (
        <>
          {p.ocopLevel && <span className="badge badge-accent stars">{stars(p.ocopLevel)}</span>}
          {p.category?.categoryName && <span className="badge">{p.category.categoryName}</span>}
        </>
      )}
      highlight={(p) => <OcopBanner product={p} />}
      facts={(p) => [
        { icon: "🏭", label: "Nhà sản xuất", value: p.producer },
        { icon: "💰", label: "Giá", value: formatPrice(p.price) },
        { icon: "⭐", label: "Hạng OCOP", value: p.ocopLevel && `${p.ocopLevel} sao` },
        { icon: "📍", label: "Địa chỉ", value: p.address, copy: true },
      ]}
      related={(p, list) => {
        const same = list.filter((x) => x.categoryId && x.categoryId === p.categoryId);
        return [...same, ...list.filter((x) => !same.includes(x))];
      }}
      relatedTitle="Đặc sản khác"
      renderRelated={(x) => (
        <ItemCard key={x.productId} to={`/ocop/${x.productId}`} image={x.imageUrl} icon="☕" title={x.name} text={x.description}>
          {x.ocopLevel && <span className="badge badge-accent stars">{stars(x.ocopLevel)}</span>}
        </ItemCard>
      )}
      aiQuestion={(p) => `${p.name} có gì đặc biệt, mua ở đâu và bảo quản thế nào khi làm quà?`}
    />
  );
}
