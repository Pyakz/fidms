import { Hono } from "hono";
import inventory from "./inventory";

const api = new Hono().route("/inventory", inventory);

export type AppType = typeof api;
export default api;
