import api from "../lib/api";
import type { WineryReadDto, WineryCreateDto, WineryUpdateDto } from "../types/api";

export async function listWineries() {
  const { data } = await api.get<WineryReadDto[]>("/api/wineries");
  return data;
}

export async function getWinery(id: number) {
  const { data } = await api.get<WineryReadDto>(`/api/wineries/${id}`);
  return data;
}

export async function createWinery(dto: WineryCreateDto) {
  const { data } = await api.post<WineryReadDto>("/api/wineries", dto);
  return data;
}

export async function updateWinery(id: number, dto: WineryUpdateDto) {
  await api.put<void>(`/api/wineries/${id}`, dto);
}

export async function deleteWinery(id: number) {
  await api.delete<void>(`/api/wineries/${id}`);
}
