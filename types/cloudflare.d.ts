interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<{
    success: boolean;
    results?: T[];
    meta: Record<string, unknown>;
  }>;
  all<T = Record<string, unknown>>(): Promise<{
    success: boolean;
    results: T[];
    meta: Record<string, unknown>;
  }>;
  raw<T = unknown[]>(): Promise<T[]>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>;
  exec(query: string): Promise<{
    count: number;
    duration: number;
  }>;
}
