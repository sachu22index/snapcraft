import { useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "@/data/products";
import { AdminProduct, ProductStatus } from "@/types/admin";
import { getProducts, getPublishedProducts, subscribeToProducts } from "@/lib/products-service";

export function usePublicProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await getPublishedProducts();
      setProducts(list);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToProducts(() => {
      refresh();
    });
    return unsubscribe;
  }, [refresh]);

  return { products, isLoading, error, refresh };
}

export function useAdminProducts(options?: {
  status?: ProductStatus | "all" | undefined;
  categoryId?: string | undefined;
  search?: string | undefined;
  sortBy?: ("newest" | "oldest" | "price-asc" | "price-desc" | "name" | "rating") | undefined;
}) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const status = options?.status;
  const categoryId = options?.categoryId;
  const search = options?.search;
  const sortBy = options?.sortBy;

  const memoizedOptions = useMemo(
    () => ({ status, categoryId, search, sortBy }),
    [status, categoryId, search, sortBy],
  );

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await getProducts(memoizedOptions);
      setProducts(list);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load admin products");
    } finally {
      setIsLoading(false);
    }
  }, [memoizedOptions]);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToProducts(() => {
      refresh();
    });
    return unsubscribe;
  }, [refresh]);

  return { products, isLoading, error, refresh };
}
