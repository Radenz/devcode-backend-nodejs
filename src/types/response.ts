export interface GenericResponse {
  status: string;
  message: string;
}

export interface EmptyData {
  data: {};
}

export interface SingleData<T> {
  data: T;
}

export interface ManyData<T> {
  data: T[];
}
