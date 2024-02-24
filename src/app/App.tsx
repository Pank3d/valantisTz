import React, { useContext, useState } from "react";
import { Card } from "../enteties/card/ui/Card";
import Brand from "../enteties/card/ui/Brand";
import { StoreContext } from "./context/StoreContext";
import { observer } from "mobx-react-lite";
import Button from "../widgets/button/Button";
import Label from "../widgets/label/Label";
import Input from "../widgets/input/Input";
import useFetchData from "../shared/api/useFetchData";
import useProductFilter from "../enteties/card/filter/Filter";


const App: React.FC = observer(() => {
  const { brandStore } = useContext(StoreContext);
  const [page, setPage] = useState<number>(1);
  const [minPrice, setMinPrice] = useState<string | number>("");
  const [maxPrice, setMaxPrice] = useState<string | number>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { products, error } = useFetchData(page);
  const filteredItems = useProductFilter(
    products,
    searchTerm,
    minPrice,
    maxPrice,
    brandStore.brand.target
  );

  return (
    <div>
      <h1 className="flex justify-center mb-10 text-4xl">Список товаров</h1>
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Brand />
      <div>
        <Label
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          text={"Минимальная цена"}
        />
        <Label
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          text={"Максимальная цена"}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="grid grid-cols-5 gap-10">
        {filteredItems.map((product) => (
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
        <Button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          title={"Предыдущая страница"}
        />
        <Button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          title={"Следующая страница"}
        />
      </div>
    </div>
  );
});

export default App;
