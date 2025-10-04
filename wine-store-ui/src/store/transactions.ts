import { create } from "zustand";
import { api } from "../lib/api";

export type Transaction = {
  id: number;
  wineId: number;
  wineName: string;
  buyerEmail: string;
  quantity: number;
  amount: number;
  createdAt: string;
};

type TransactionsState = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  clear: () => void;
};

export const useTransactions = create<TransactionsState>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/transactions"); // prilagodi ako je ruta drugačija
      set({ transactions: res.data, loading: false });
    } catch (err: any) {
      set({ error: "Failed to fetch transactions", loading: false });
    }
  },

  clear: () => set({ transactions: [] }),
}));
