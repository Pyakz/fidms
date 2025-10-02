import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hcWithType } from "../../../server/src/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
export const honoClient = hcWithType(SERVER_URL);
