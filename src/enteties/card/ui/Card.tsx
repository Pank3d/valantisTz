import { cardInter } from "../../../shared/type/type";

export const Card = ({ product, price, brand }: cardInter) => {
  return (
    <div  className=" bg-slate-400 w-13 ">
      <p className=" text-3xl">{product}</p>
      <p className=" text-2xl">{brand}</p>
      <p className="text-3xl">{`${price} р`}</p>
    </div>
  );
};
