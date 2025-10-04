import { create } from "zustand";
import { api } from "../lib/api";

export type OrderItem = {
  orderItemId: number;
  wineId: number;
  quantity: number;
  price: number;
};

export type Order = {
  orderId: number;
  userId: number;
  createdAt: string;
  total: number;
  items: OrderItem[];
};

type OrdersState = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  clear: () => void;
};

export const useOrders = create<OrdersState>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/orders/my"); // prilagodi ako je ruta drugačija
      set({ orders: res.data, loading: false });
    } catch (err: any) {
      set({ error: "Failed to fetch orders", loading: false });
    }
  },

  clear: () => set({ orders: [] }),
}));
