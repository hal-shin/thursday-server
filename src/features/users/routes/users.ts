import { FastifyPluginCallback } from "fastify/types/plugin";
import { getUsers } from "../handlers/users.js";

export const userRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get("/", getUsers);

  done();
};
