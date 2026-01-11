/**
 * Generic Interface for Adapters
 * T = Domain Model (CamelCase, Frontend Optimized)
 * D = DTO (SnakeCase, Backend Optimized)
 */
export interface BaseAdapter<T, D> {
  /**
   * Adapts a raw API response (DTO) to the Domain Model
   */
  toDomain(dto: D): T;

  /**
   * Adapts a Domain Model (or request payload) to the backend DTO structure.
   * Optional because not all models are sent back to the server fully.
   */
  toDTO?(domain: Partial<T>): Partial<D>;
}

/**
 * Helper to adapt an array of DTOs
 */
export function adaptArray<T, D>(adapter: BaseAdapter<T, D>, dtos: D[]): T[] {
  return dtos.map((dto) => adapter.toDomain(dto));
}
