import fastify from "fastify";
import config from "./plugins/config.js";
import { registerFeatures } from "./routes.js";
import db from "./plugins/db.js";
import swagger from "./plugins/swagger.js";
import cors from "./plugins/cors.js";

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL,
  },
});

// Register plugins
await server.register(config);
await server.register(cors);
await server.register(db);
await server.register(swagger);

await registerFeatures(server);

await server.ready();

server.ready((err) => {
  if (err) throw err;
  server.swagger();
});

export default server;

if (process.env.NODE_ENV !== "test") {
  process.on("unhandledRejection", (err) => {
    console.error(err);
    process.exit(1);
  });
  await server.listen(+server.config.API_PORT, server.config.API_HOST);

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }
}
