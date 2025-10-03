import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema";

const dbClient = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema: schema,
  logger: true,
});

export default dbClient;
