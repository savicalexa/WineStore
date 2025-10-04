import api from "../lib/api";
import type { CategoryReadDto, CategoryCreateDto, CategoryUpdateDto, Paged, WineReadDto } from "../types/api";

export async function listCategories() {
  const { data } = await api.get<CategoryReadDto[]>("/api/categories");
  return data;
}

export async function getCategory(id: number) {
  const { data } = await api.get<CategoryReadDto>(`/api/categories/${id}`);
  return data;
}

export async function createCategory(dto: CategoryCreateDto) {
  const { data } = await api.post<CategoryReadDto>("/api/categories", dto);
  return data;
}

export async function updateCategory(id: number, dto: CategoryUpdateDto) {
  await api.put<void>(`/api/categories/${id}`, dto);
}

export async function deleteCategory(id: number) {
  await api.delete<void>(`/api/categories/${id}`);
}

export async function listWinesByCategory(
  categoryId: number,
  params: { page?: number; pageSize?: number; q?: string }
) {
  const { data } = await api.get<Paged<WineReadDto>>(`/api/categories/${categoryId}/wines`, { params });
  return data;
}
