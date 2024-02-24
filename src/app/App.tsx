import React, { useContext, useEffect, useState } from "react";
import { Card } from "../enteties/card/ui/Card";
import { Product, RequestData } from "../shared/type/type";
import { generateHeaders, makeApiRequest } from "../shared/api/api";
import Brand from "../enteties/card/ui/Brand";
import { StoreContext } from "./context/StoreContext";
import { observer } from "mobx-react-lite";

const App: React.FC = observer(() => {
  const { brandStore } = useContext(StoreContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<any>(1);
  const [minPrice, setMinPrice] = useState<any | "">("");
  const [maxPrice, setMaxPrice] = useState<any | "">("");
  const [uniqueProductIds, setUniqueProductIds] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");

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
          const newUniqueIds = productIds.filter(
            (id) => !uniqueProductIds.has(id)
          );
          if (newUniqueIds.length > 0 || page === 1) {
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

  const filteredItems = products.filter((product) => {
    const brandValues = brandStore.brand.target;
    console.log("Brand values:", brandValues);

    const brandMatch =
      !brandValues ||
      brandValues.length === 0 ||
      brandValues.includes(product.brand);

    const searchMatch =
      product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    return brandMatch && searchMatch;
  });

  const filteredByPriceRange = filteredItems.filter((product) => {
    if (minPrice === "" && maxPrice === "") {
      return true;
    }
    const price = parseFloat(product.price);
    const min =
      minPrice !== "" ? parseFloat(minPrice) : Number.NEGATIVE_INFINITY;
    const max =
      maxPrice !== "" ? parseFloat(maxPrice) : Number.POSITIVE_INFINITY;
    return price >= min && price <= max;
  });

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  return (
    <div>
      <h1 className="flex justify-center mb-10 text-4xl">Список товаров</h1>
      <input
        className="w-100 border "
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Brand />
      <div>
        <label>
          Минимальная цена:
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
        </label>
        <label>
          Максимальная цена:
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </label>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="grid grid-cols-5 gap-10">
        {filteredByPriceRange.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            product={product.product}
            price={product.price}
            brand={product.brand}
          />
        ))}
      </div>
      <div className="flex justify-between mt-10 mb-10">
        <button
          className="ml-3 rounded bg-slate-400 w-13 h-10"
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
        >
          Предыдущая страница
        </button>
        <button
          className="mr-3 rounded bg-slate-400 w-13 h-10"
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          Следующая страница
        </button>
      </div>
    </div>
  );
});

export default App;
