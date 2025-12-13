import { useEffect, useState } from "react";
import type { Option } from "../../models/Option";
import { getAllOptions, filterOptions } from "./api";

export const useOptions = (ticker: string | null, enabled: boolean) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ticker || !enabled) return;

    const load = async () => {
      setLoading(true);

      const data =
        Object.keys(filters).length === 0
          ? await getAllOptions(ticker)
          : await filterOptions(ticker, filters);

      setOptions(data);
      setLoading(false);
    };

    load();
  }, [ticker, enabled, filters]);

  return {
    options,
    loading,
    setFilter: (key: string, value: string) =>
      setFilters((prev) => {
        const next = { ...prev };
        if (value === "") delete next[key];
        else next[key] = value;
        return next;
      }),
    filters,
  };
};
