import api from "../lib/api";
import type { WebhookEventReadDto, WebhookEventCreateDto } from "../types/api";

export async function listWebhookEvents() {
  const { data } = await api.get<WebhookEventReadDto[]>("/api/webhooks");
  return data;
}

export async function createWebhookEvent(dto: WebhookEventCreateDto) {
  await api.post<void>("/api/webhooks", dto);
}
