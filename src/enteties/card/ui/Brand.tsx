import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "../../../app/context/StoreContext";

const Brand = observer(() => {
  const brandArray: string[] = [
    "Bibigi",
    "VanCleefandArpels",
    "Pomellato",
    "PasqualeBruni",
    "YakutskBril",
    "Cartier",
    "Piaget",
    "Baraka",
    "Casato",
    "Imma",
    "Unknown",
  ];
  const { brandStore } = useContext(StoreContext);

  const selectedBrands = brandStore.brand.target || [];
    const handleToggleBrand = (brand: string) => {
      console.log("Toggling brand:", brand);
      brandStore.toggleBrand(brand);
  
      brandStore.setBrand([...brandStore.brand.target]);
    };

  return (
    <ul className="flex justify-between mr-3 ml-3">
      {brandArray.map((brand) => (
        <li key={brand}>
          {brand}
          <input
            type="checkbox"
            checked={selectedBrands.includes(brand)}
            onChange={() => handleToggleBrand(brand)}
          />
        </li>
      ))}
    </ul>
  );
});

export default Brand;
