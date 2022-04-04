import { FastifyPluginCallback } from "fastify/types/plugin";
import { User } from "../models/user.js";

export const authRoutes: FastifyPluginCallback = (server, opts, done) => {
  server.post<{
    Body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
  }>("/login", (request, reply) => {
    const { email, password } = request.body;
    const { User } = server.db.models;

    reply.send("Login reached.");
  });
  server.post<{
    Body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
  }>("/register", async (request, reply) => {
    const { email } = request.body;

    const { User } = server.db.models;

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      return reply.code(409).send({ message: "That email is already taken." });
    }

    const user = await User.addOne(request.body);
    await user.save();

    return reply.code(201).send(user);
  });

  done();
};
