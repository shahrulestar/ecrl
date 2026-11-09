import { en } from "./en";

type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepWiden<U>[]
    : T extends object
      ? { [K in keyof T]: DeepWiden<T[K]> }
      : T;

export type Messages = DeepWiden<typeof en>;
