import api from "../lib/api";
import type { Paged, WineReadDto, WineCreateDto, WineUpdateDto } from "../types/api";

export async function listWines(params: {
  page?: number; pageSize?: number; q?: string;
  categoryId?: number; wineryId?: number;
  minPrice?: number; maxPrice?: number;
}) {
  const { data } = await api.get<Paged<WineReadDto>>("/api/wines", { params });
  return data;
}

export async function getWine(id: number) {
  const { data } = await api.get<WineReadDto>(`/api/wines/${id}`);
  return data;
}

export async function createWine(dto: WineCreateDto) {
  const { data } = await api.post<WineReadDto>("/api/wines", dto);
  return data;
}

export async function updateWine(id: number, dto: WineUpdateDto) {
  await api.put<void>(`/api/wines/${id}`, dto);
}

export async function deleteWine(id: number) {
  await api.delete<void>(`/api/wines/${id}`);
}
