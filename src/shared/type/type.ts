export interface cardInter {
    id:string,
    product:string,
    price:number,
    brand:string 
}

export interface Product {
  id: string;
  product: string;
  name: string;
  price: number | any;
  brand: string;
}

export interface RequestParams {
  offset?: number;
  limit?: number;
  ids?: string[];
  field?: string;
}

export interface RequestData {
  action: string;
  params: RequestParams;
}

export interface RequestHeaders {
  "X-Auth": string;
}