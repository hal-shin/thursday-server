import { RouteHandler } from "fastify/types/route";

export const getUsers: RouteHandler = (req, reply) => {
  reply.send([]);
};
