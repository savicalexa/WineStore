import api from "../lib/api";
import type { UserReadDto, UserCreateDto, UserUpdateDto } from "../types/api";

export async function listUsers() {
  const { data } = await api.get<UserReadDto[]>("/api/users");
  return data;
}

export async function getUser(id: number) {
  const { data } = await api.get<UserReadDto>(`/api/users/${id}`);
  return data;
}

export async function createUser(dto: UserCreateDto) {
  const { data } = await api.post<UserReadDto>("/api/users", dto);
  return data;
}

export async function updateUser(id: number, dto: UserUpdateDto) {
  await api.put<void>(`/api/users/${id}`, dto);
}

export async function deleteUser(id: number) {
  await api.delete<void>(`/api/users/${id}`);
}
