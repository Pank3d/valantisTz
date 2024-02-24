import React, { useContext, useEffect, useState } from "react";
import { Card } from "../enteties/card/ui/Card";
import { Product, RequestData } from "../shared/type/type";
import { generateHeaders, makeApiRequest } from "../shared/api/api";
import Brand from "../enteties/card/ui/Brand";
import { StoreContext } from "./context/StoreContext";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [uniqueProductIds, setUniqueProductIds] = useState<Set<string>>(
    new Set()
  );

  const { brandStore } = useContext(StoreContext);

  useEffect(() => {
    const fetchData = async () => {
      const url = import.meta.env.VITE_BASE_URL;
      const limit = 50;
      const offset = page * limit;

      const requestData: RequestData = {
        action: "get_ids",
        params: {
          offset: offset,
          limit: limit,
        },
      };

      try {
        const headers = generateHeaders("Valantis");
        const data = await makeApiRequest(url, requestData, headers);
        console.log("Data received:", data);
        if (data && data.result) {
          const productIds: any[] = [...new Set(data.result)];
          // Проверяем, есть ли новые идентификаторы продуктов
          const newUniqueIds = productIds.filter(
            (id) => !uniqueProductIds.has(id)
          );
          if (newUniqueIds.length > 0 || page === 1) {
            // Обновляем уникальные идентификаторы только при новых данных или на первой странице
            setUniqueProductIds(
              new Set([...uniqueProductIds, ...newUniqueIds])
            );
            const productsData = await fetchProductsData(newUniqueIds);
            console.log("Products data:", productsData);
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

  const fetchProductsData = async (productIds: string[]) => {
    const url = import.meta.env.VITE_BASE_URL;

    const requestData: RequestData = {
      action: "get_items",
      params: {
        ids: productIds,
      },
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

  const filteredItems = products?.filter((product) => {
    const brandValues = brandStore.brand.target;
    console.log(brandValues )
    if (!brandValues || brandValues.length === 0) {
      return true;
    }
    return brandValues.includes(product.brand);
  });
  
  console.log("brandStore.brand:", brandStore.brand);
  console.log("products:", products);
  console.log("filteredItems:", filteredItems);

  return (
    <div>
      <h1 className="flex justify-center mb-10 text-4xl">Список товаров</h1>
      <Brand />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="grid grid-cols-5 gap-10">
        {filteredItems &&
          [
            ...new Map(filteredItems.map((product) => [product.id, product])),
          ].map(([id, product]) => (
            <Card
              key={id}
              id={id}
              product={product.product}
              price={product.price}
              brand={product.brand}
            />
          ))}
      </div>
      <div className="flex justify-between mt-10 mb-10  ">
        <button
          className=" ml-3 rounded  bg-slate-400 w-13 h-10"
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
        >
          Предыдущая страница
        </button>
        <button
          className=" mr-3 rounded bg-slate-400 w-13 h-10"
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          Следующая страница
        </button>
      </div>
    </div>
  );
};

export default App;
