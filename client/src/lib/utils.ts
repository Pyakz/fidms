import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hcWithType } from "@server/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const honoClient = hcWithType(`/api`);
