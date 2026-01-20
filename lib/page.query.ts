export type PaginationParams = {
  page?: number;
  limit?: number;
  keyword?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

export function buildQuery(params: Record<string, unknown>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query.toString();
}
