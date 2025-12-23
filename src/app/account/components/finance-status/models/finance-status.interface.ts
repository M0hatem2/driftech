export interface FinanceRequest {
  id: number;
  full_name: string;
  phone: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  status: string;
  created_at: string;
}

export interface FinanceRequestsResponse {
  can_apply: boolean;
  data: FinanceRequest[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}