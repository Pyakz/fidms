import app from ".";

const server = Bun.serve({
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
});

console.log(`Server started on http://localhost:${server.port}`);

export type AppType = typeof app;
