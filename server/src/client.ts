import { hc } from "hono/client";
import type { ApiType } from ".";

export const apiWithType = (
  ...args: Parameters<typeof hc>
): ReturnType<typeof hc<ApiType>> => hc<ApiType>(...args);
