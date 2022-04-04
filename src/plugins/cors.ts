import fastifyCors from "fastify-cors";
import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

const corsPlugin: FastifyPluginAsync = async (server) => {
  // server.register(fastifyCors, {
  //   origin: false,
  //   methods: ["GET", "POST"],
  // });
};

export default fp(corsPlugin);
