import { useEffect, useState } from "react";
import { Product, RequestData } from "../type/type";
import { generateHeaders, makeApiRequest } from "./api";


const useFetchData = (page: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uniqueProductIds, setUniqueProductIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchData = async () => {
      const url: string = import.meta.env.VITE_BASE_URL;
      const limit: number = 50;
      const offset: number = page * limit;
      const requestData: RequestData = {
        action: "get_ids",
        params: { offset, limit },
      };

      try {
        const headers = generateHeaders("Valantis");
        const data = await makeApiRequest(url, requestData, headers);

        if (data && data.result) {
          const productIds: string[] = [...new Set(data.result as string[])];
          const newUniqueIds = productIds.filter(
            (id) => !uniqueProductIds.has(id)
          );

          if (newUniqueIds.length > 0 || page === 1) {
            setUniqueProductIds(
              new Set([...uniqueProductIds, ...newUniqueIds])
            );
            const productsData = await fetchProductsData(newUniqueIds);
            setProducts((prevProducts) => [...prevProducts, ...productsData]);
          }
        } else if (data && data.error) {
          setError(data.error);
        } else {
          setError("Не удалось получить данные о товарах");
        }
      } catch (error) {
        console.error(
          "Произошла ошибка при получении данных о товарах:",
          error
        );
        setError("Произошла ошибка при получении данных о товарах");
      }
    };

    fetchData();
  }, [page]);

  const fetchProductsData = async (
    productIds: string[]
  ): Promise<Product[]> => {
    const url: string = import.meta.env.VITE_BASE_URL;
    const requestData: RequestData = {
      action: "get_items",
      params: { ids: productIds },
    };

    const headers = generateHeaders("Valantis");
    const data = await makeApiRequest(url, requestData, headers);

    if (data && data.error) {
      setError(data.error);
      return [];
    }

    const productsData: Product[] = data.result.map((item: any) => ({
      id: item.id,
      product: item.product,
      name: item.name,
      price: item.price,
      brand: item.brand || "Unknown",
    }));

    return productsData;
  };

  return { products, error };
};

export default useFetchData;
