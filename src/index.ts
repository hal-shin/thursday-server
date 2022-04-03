import fastify from "fastify";
import config from "./plugins/config.js";
import { registerFeatures } from "./routes.js";

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL,
  },
});

await server.register(config);
await registerFeatures(server);

await server.ready();

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
