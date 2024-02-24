import { useState, useEffect } from "react";
import { Product } from "../../../shared/type/type";

const useProductFilter = (
  products: Product[],
  searchTerm: string,
  minPrice: string | number,
  maxPrice: string | number,
  selectedBrands: string[]
) => {
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);

  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter((product) => {
        const brandMatch =
          selectedBrands.length === 0 || selectedBrands.includes(product.brand);

        const searchMatch =
          product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase());

        const price = parseFloat(product.price);
        const min =
          minPrice !== ""
            ? parseFloat(minPrice as string)
            : Number.NEGATIVE_INFINITY;
        const max =
          maxPrice !== ""
            ? parseFloat(maxPrice as string)
            : Number.POSITIVE_INFINITY;
        const priceMatch = price >= min && price <= max;

        return brandMatch && searchMatch && priceMatch;
      });

      setFilteredItems(filtered);
    };

    filterProducts();
  }, [products, searchTerm, minPrice, maxPrice, selectedBrands]);

  return filteredItems;
};

export default useProductFilter;
