import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TimestampedEntity } from "../types/index.js";
import { uuid } from "../libs/uuid.js";

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserModel extends mongoose.Model<UserDocument> {
  addOne(doc: UserAttrs): UserDocument;
  generateToken(): string;
  findByToken(token: string): UserModel;
  findByCredentials(token: string): UserModel;
}

export interface UserDocument extends mongoose.Document, TimestampedEntity {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
  tokens: Array<{ token: string }>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// encrypt password using bcrypt conditionally. Only if the user is newly created.
// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    if (!user.salt) {
      user.salt = uuid();
    }

    user.password = await bcrypt.hash(user.password + user.salt, 8);
  }
  next();
});

userSchema.methods.generateToken = async function () {
  let user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.addOne = async (doc: UserAttrs) => {
  return new User(doc);
};

// create a custom model method to find user by token for authentication
userSchema.statics.findByToken = async function (token) {
  let User = this;
  let decoded;
  try {
    if (!token) {
      return new Error("Missing token header");
    }
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return error;
  }

  if (typeof decoded === "string") {
    return "Something went wrong in the JWT.";
  }

  return await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });
};

// create a new mongoose method for user login authentication
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login. Wrong email!");
  }
  const isMatch = await bcrypt.compare(password + user.salt, user.password);
  if (!isMatch) {
    throw new Error("Unable to login. Wrong Password!");
  }
  return user;
};

export const User = mongoose.model<UserDocument, UserModel>("user", userSchema);
