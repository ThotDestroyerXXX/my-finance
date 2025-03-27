import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value: number) {
  return new Intl.NumberFormat().format(value);
}

export function calculateBar(value: string | 0 | undefined, total: string) {
  return (Number(value) / Number(total)) * 100;
}
