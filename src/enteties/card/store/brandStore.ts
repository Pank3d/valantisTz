import { makeAutoObservable } from "mobx";

class BrandStore {
  brand: {
    target: string[];
    length: number;
    includes(brand: string): boolean;
  } = {
    target: [],
    length: 0,
    includes: function (brand: string): boolean {
      return this.target.includes(brand);
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  setBrand(brand: string[]): void {
    this.brand.target = brand;
  }

  toggleBrand(brand: string): void {
    if (this.brand.includes(brand)) {
      this.brand.target = this.brand.target.filter((r) => r !== brand);
    } else {
      this.brand.target.push(brand);
    }
    console.log("Updated brand:", this.brand);
  }

  getBrands(): string[] {
    // Новый метод для получения массива выбранных брендов
    return this.brand.target;
  }
}

export default new BrandStore();
