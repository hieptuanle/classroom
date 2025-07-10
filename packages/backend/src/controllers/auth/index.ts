import jwt from "jsonwebtoken";
import config from "config";
import {
  sendSuccess,
  sendCreated,
  sendInternalServerError,
  sendUnauthorized,
} from "@backend/helpers/response.js";
import { Request, Response } from "express";
import User from "@backend/models/User.js";

// const privateKey = config.key.privateKey;
// const tokenExpireInSeconds = config.key.tokenExpireInSeconds;

export const register = async (req: Request<any, any, { username: string, password: string, full_name: string, avatar: string }, any>, res: Response) => {
  const user = await User.findOne({ where: { username: req.body.username } })

  if (user) {
    sendInternalServerError(res, "User already exists.");
  } else {
    const newUser = User.build({
      username: req.body.username,
      password: req.body.password,
      full_name: req.body.full_name,
      avatar: req.body.avatar,
      role: "student",
    });

    await newUser.save();

    sendCreated(res, {
      success: true,
      message: "User created.",
      data: { user: newUser },
    });
  }
};

export const authenticate = async (req, res) => {
  User.findOne({ username: req.body.username }).exec(function (err, user) {
    if (err) throw err;

    if (!user) {
      console.log("User not found");
      sendUnauthorized(res, "Authentication failed.");
    } else if (user) {
      user.verifyPassword(req.body.password, function (_err, isMatch) {
        if (_err) {
          console.log("Error verifying password");
          sendInternalServerError(res, "Internal server error.");
        }
        if (isMatch) {
          console.log("User found and password matched");
          const token = jwt.sign(user.getTokenData(), privateKey, {
            expiresIn: tokenExpireInSeconds,
          });

          sendSuccess({
            success: true,
            message: "Token created.",
            data: { token: token },
          });
        } else {
          console.log("Password not match");
          sendUnauthorized(res, "Authentication failed.");
        }
      });
    }
  });
};

export const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    jwt.verify(token, privateKey, function (err, decoded) {
      if (err) {
        sendUnauthorized(res, "Failed to authenticate token.");
      } else {
        User.findById(decoded.id, function (err, user) {
          if (err) res.send(err);
          req.currentUser = user;
          next();
        });
      }
    });
  } else {
    sendUnauthorized(res, "No token provided.");
  }
};
