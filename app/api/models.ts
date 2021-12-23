export interface PaginationType {
    count: number;
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }
  
  export type ApiMeta = {
    pagination: PaginationType;
  } & any;
  
  export interface ApiResponse<T> {
    data: T;
    meta: ApiMeta;
  }
  
  export interface PaginationQueryConfig extends PaginationQueryParams {
    page?: number;
    sort?: string;
  }
  
  export interface PaginationQueryParams {
    q?: string;
    client?: string;
  
    // allow extra keys in here.
    [key: string]: any;
  }
  
  export type RewriteAdmin<T> = Omit<
    T,
    "name_localized" | "description_localized"
  > & {
    name_localized: { [key: string]: string };
    description_localized: { [key: string]: string };
  };
  