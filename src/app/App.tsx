import React, { useEffect, useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import md5 from "md5-js";
import Card from "../enteties/card/Card";
import { Product, RequestData, RequestHeaders } from "../shared/type/type";



const generateHeaders = (password: string): RequestHeaders => {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const stringToHash = `${password}_${currentDate}`;
  const hash = md5(stringToHash);

  return {
    "X-Auth": hash,
  };
};

const makeApiRequest = async (
  url: string,
  requestData: RequestData,
  headers: any,
  retryCount: number = 3
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(url, requestData, {
      headers,
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Произошла ошибка при выполнении запроса:", axiosError);
    if (axiosError.response?.data) {
      console.error("Идентификатор ошибки:", axiosError.response.data);
    }

    if (retryCount > 0) {
      console.log(`Повторный запрос. Осталось попыток: ${retryCount}`);
      return makeApiRequest(url, requestData, headers, retryCount - 1);
    } else {
      throw new Error("Произошла ошибка при выполнении запроса");
    }
  }
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [uniqueProductIds, setUniqueProductIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://api.valantis.store:40000/";
      const limit = 50; // Количество товаров на странице
      const offset = (page - 1) * limit; // Смещение для загрузки товаров на текущей странице

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
          const productIds: string[] = data.result;
          const uniqueIds = new Set(
            productIds.filter((id) => !uniqueProductIds.has(id))
          ); // Фильтруем уже существующие идентификаторы
          setUniqueProductIds(new Set([...uniqueProductIds, ...uniqueIds])); // Объединяем уникальные идентификаторы с уже существующими
          const productsData = await fetchProductsData(Array.from(uniqueIds));
          console.log("Products data:", productsData);
          setProducts(productsData); // Устанавливаем загруженные товары на текущей странице
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
    const url = "http://api.valantis.store:40000/";

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

  return (
    <div>
      <h1 className="flex justify-center mb-10 text-4xl">Список товаров</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="grid grid-cols-5 gap-10">
        {[...products].map((product) => (
          <Card
            key={product.id}
            id={product.id}
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
