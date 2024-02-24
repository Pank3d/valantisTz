import { makeAutoObservable } from "mobx";

class brandStore {
  brand: string[] = []; // Здесь изменение типа на массив строк

  constructor() {
    makeAutoObservable(this);
  }

  setBrand(brand: string[]): void {
    this.brand = brand;
  }

  toggleBrand(brand: string): void {
    if (this.brand.includes(brand)) {
      this.brand = this.brand.filter((r) => r !== brand);
    } else {
      this.brand.push(brand);
    }
  }
}

export default new brandStore();
