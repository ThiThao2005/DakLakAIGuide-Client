import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Khi chuyển trang (ví dụ bấm "Có thể bạn quan tâm"), cuộn về đầu trang
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
