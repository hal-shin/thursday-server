import fp from "fastify-plugin";
import fastifyMongodb from "fastify-mongodb";
import { FastifyPluginCallback } from "fastify/types/plugin";
import mongoose, { Mongoose } from "mongoose";
import { User, UserModel } from "../models/user.js";

export interface Models {
  User: UserModel;
}

export interface Db {
  models: Models;
  db: Mongoose;
}

const dbPlugin: FastifyPluginCallback = async (server, options, done) => {
  const mongoUrl = server.config.MONGODB_URL;

  try {
    mongoose.connection.on("connected", () => {
      server.log.info({ actor: "MongoDB" }, "connected");
    });
    mongoose.connection.on("disconnected", () => {
      server.log.error({ actor: "MongoDB" }, "disconnected");
    });
    const db = await mongoose.connect(mongoUrl, { dbName: "thursday" });
    const models: Models = { User };
    server.decorate("db", db);
    server.decorate("models", { models });
  } catch (error) {
    console.error(error);
  }

  server.register(fastifyMongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: mongoUrl,
  });

  done();
};

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
    db: Db;
  }
}

export default fp(dbPlugin);
