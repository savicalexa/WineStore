import api from "../lib/api";
import type { PaymentReadDto, PaymentCreateDto, PaymentUpdateStatusDto } from "../types/api";

export async function getPaymentForOrder(orderId: number) {
  const { data } = await api.get<PaymentReadDto>(`/api/payments/${orderId}`);
  return data;
}

export async function createPayment(dto: PaymentCreateDto) {
  const { data } = await api.post<PaymentReadDto>("/api/payments", dto);
  return data;
}

export async function updatePaymentStatus(paymentId: number, dto: PaymentUpdateStatusDto) {
  await api.put<void>(`/api/payments/${paymentId}/status`, dto);
}
