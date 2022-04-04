import { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/users.js";
import { authRoutes } from "./routes/auth.js";

export const registerFeatures = async (fastify: FastifyInstance) => {
  fastify.register(userRoutes, { prefix: "/users" });
  fastify.register(authRoutes, { prefix: "/auth" });
};
