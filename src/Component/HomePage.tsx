import ProductList from "./Sub-Component/ProductList";
import NoticeSlide from "./Sub-Component/NoticeSlide";

export default function HomePage() {
  return (
    <div>
      <NoticeSlide />
      <ProductList />
    </div>
  );
}
