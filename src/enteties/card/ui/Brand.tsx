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
    "Unknown"
  ];
  const { brandStore } = useContext(StoreContext);
  return (
    <ul className=" flex justify-between mr-3 ml-3">
      {brandArray.map((brandArray) => (
        <li className="" key={brandArray}>
          {brandArray}
          <input
            type="checkbox"
            checked={brandStore.brand.includes(brandArray)}
            onChange={() => brandStore.toggleBrand(brandArray)}
          />
        </li>
      ))}
    </ul>
  );
})

export default Brand;
