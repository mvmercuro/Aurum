import axios from "axios";

const api = axios.create({
  baseURL: typeof window === 'undefined'
    ? (process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')) + '/api'
    : '/api',
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Product {
  id: number;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
  categoryId: number;
  inventoryCount: number;
  thcPercentage: string | null;
  cbdPercentage: string | null;
  strainType: "indica" | "sativa" | "hybrid" | null;
  brand: string | null;
  weight: string | null;
  effects: string[];
}

export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ZipCheckResponse {
  available: boolean;
  zip?: string;
  regionId?: number;
  regionName?: string;
  deliveryFeeCents?: number;
  minimumOrderCents?: number;
  error?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  paymentMethod: "cash" | "debit";
}

export interface CreateOrderResponse {
  success: boolean;
  orderNumber: string;
  orderId: number;
  totalCents: number;
  message: string;
}

export const productsApi = {
  getAll: async (categoryId?: number): Promise<Product[]> => {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get("/products", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories/all");
    return response.data;
  },
};

export const ordersApi = {
  checkZip: async (zip: string): Promise<ZipCheckResponse> => {
    const response = await api.post("/orders/check-zip", { zip });
    return response.data;
  },

  create: async (order: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await api.post("/orders", order);
    return response.data;
  },

  getByOrderNumber: async (orderNumber: string, phone: string) => {
    const response = await api.get(`/orders/${orderNumber}`, {
      params: { phone },
    });
    return response.data;
  },
};

export default api;
