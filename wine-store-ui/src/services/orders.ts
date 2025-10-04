import api from "../lib/api";
import type { OrderReadDto, OrderCreateDto, OrderUpdateDto } from "../types/api";

export async function listOrders() {
  const { data } = await api.get<OrderReadDto[]>("/api/orders");
  return data;
}

export async function getOrder(id: number) {
  const { data } = await api.get<OrderReadDto>(`/api/orders/${id}`);
  return data;
}

export async function createOrder(dto: OrderCreateDto) {
  const { data } = await api.post<OrderReadDto>("/api/orders", dto);
  return data;
}

export async function updateOrder(id: number, dto: OrderUpdateDto) {
  await api.put<void>(`/api/orders/${id}`, dto);
}

export async function deleteOrder(id: number) {
  await api.delete<void>(`/api/orders/${id}`);
}
