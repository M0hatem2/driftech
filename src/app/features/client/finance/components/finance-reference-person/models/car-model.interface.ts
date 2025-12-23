export interface Brand {
  id: string;
  name: string;
  image: string | null;
}

export interface CarModel {
  id: string;
  name: string;
  brand: Brand;
  created_at: string;
  updated_at: string;
}

export interface CarModelsResponse {
  data: CarModel[];
}

export interface GroupedCarModels {
  [brandName: string]: CarModel[];
}