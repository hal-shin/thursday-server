import { FastifyPluginCallback } from "fastify/types/plugin";

import { RouteHandler } from "fastify/types/route";

export const getUsers: RouteHandler = (req, reply) => {
  reply.send([]);
};

export const createUser: RouteHandler = (req, reply) => {
  reply.send({});
};

export const getUserById: RouteHandler = (req, reply) => {
  reply.send({});
};

export const userRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get users",
        description: "Retrieves all users.",
        response: {
          200: {
            description: "Successful response",
            type: "object",
          },
        },
      },
    },
    getUsers,
  );
  fastify.post("/", createUser);
  fastify.get("/:userId", getUserById);

  done();
};
