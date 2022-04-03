import { FastifyInstance } from "fastify";
import { usersFeature } from "./features/users/index.js";

export const registerFeatures = async (fastify: FastifyInstance) => {
  const features = [usersFeature];

  for (const feature of features) {
    await feature(fastify);
  }
};
