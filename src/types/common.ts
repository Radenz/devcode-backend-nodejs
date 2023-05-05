export type Nullable<T> = T | null;

export interface GenericJson {
  [key: string]: any;
}

export type MaybeEmpty<T extends GenericJson> = T | {};
