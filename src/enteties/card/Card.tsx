import { cardInter } from "../../shared/type/type"


const Card = ({id, product, price, brand}:cardInter ) => {
  return (
    <div key={id} className=" bg-slate-400 w-13 ">
      <p className=" text-3xl">{product}</p>
      <p className=" text-2xl">{brand}</p>
      <p className="text-3xl">  {`${price} р`}</p>
    </div>
  );
};

export default Card