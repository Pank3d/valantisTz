import { makeAutoObservable } from "mobx";

class brandStore {
  brand: {
    length: number;
    includes(brand: string): unknown; target: string[] 
} = {
  target: [],
  length: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  includes: function (brand: string): unknown {
    throw new Error("Function not implemented.");
  }
};

  constructor() {
    makeAutoObservable(this);
  }

  setBrand(brand: string[]): void {
    this.brand.target = brand;
  }

  toggleBrand(brand: string): void {
    if (this.brand.target.includes(brand)) {
      this.brand.target = this.brand.target.filter((r) => r !== brand);
    } else {
      this.brand.target.push(brand);
    }
    console.log("Updated brand:", this.brand);
  }
}

export default new brandStore();
