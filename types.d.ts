import { Dispatch, SetStateAction } from "react";

export type ILucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref">>;

export type IDispatchState<T = any> = Dispatch<SetStateAction<T>>;
