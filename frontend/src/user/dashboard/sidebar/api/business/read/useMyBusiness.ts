// src/user/configurator/business/api/useMyBusinesses.ts
import { useEffect, useState } from "react";
import { listMyBusinesses } from "@src/user/editor/business/api/business.list";

export function useMyBusinesses() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyBusinesses()
      .then((res) => {
        if (res?.ok && Array.isArray(res.items)) {
          setItems(res.items);
        } else {
          setItems([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}
