import { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/index.js";

export const usersFeature = async (fastify: FastifyInstance) => {
  await fastify.register(userRoutes, { prefix: "/users/v1" });
};
