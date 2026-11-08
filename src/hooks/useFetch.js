import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../api/axiosClient";

// Gọi API khi component hiển thị; trả về { data, loading, error, reload }
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fetcher, deps);

  const reload = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    load()
      .then((res) => !cancelled && setData(res.data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, "Không tải được dữ liệu")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [load]);

  useEffect(() => reload(), [reload]);

  return { data, loading, error, reload };
}
