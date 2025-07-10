import jwt from "jsonwebtoken";
import config from "config";
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendInternalServerError,
  sendUnauthorized,
} from "@backend/helpers/response.js";
import { Request, Response, NextFunction } from "express";
import User from "@backend/models/User.js";

const privateKey = config.get("key.privateKey") as string;
const tokenExpireInSeconds = config.get("key.tokenExpireInSeconds") as number;

export const register = async (req: Request<any, any, { username: string, password: string, full_name: string, avatar: string }, any>, res: Response) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (user) {
      sendBadRequest(res, "User already exists.");
      return;
    }

    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      full_name: req.body.full_name,
      avatar: req.body.avatar,
      role: "student",
    });

    sendCreated(res, {
      success: true,
      message: "User created.",
      data: { user: newUser },
    });
  } catch (error) {
    console.error("Registration error:", error);
    sendInternalServerError(res, "Failed to create user.");
  }
};


export const authenticate = async (req: Request<any, any, { username: string, password: string }, any>, res: Response) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    
    if (!user) {
      console.log("User not found");
      sendUnauthorized(res, "Authentication failed.");
      return;
    }
    
    // Note: User model needs verifyPassword method implementation
    // For now, direct password comparison (should be hashed in production)
    if (user.dataValues.password === req.body.password) {
      console.log("User found and password matched");
      const token = jwt.sign({ id: user.dataValues.id, username: user.dataValues.username }, privateKey, {
        expiresIn: tokenExpireInSeconds,
      });

      sendSuccess(res, {
        success: true,
        message: "Token created.",
        data: { token: token },
      });
    } else {
      console.log("Password not match");
      sendUnauthorized(res, "Authentication failed.");
    }
  } catch (err) {
    console.error("Authentication error:", err);
    sendInternalServerError(res, "Internal server error.");
  }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    jwt.verify(token, privateKey, async function (err: any, decoded: any) {
      if (err) {
        sendUnauthorized(res, "Failed to authenticate token.");
      } else {
        try {
          const user = await User.findByPk(decoded.id);
          if (!user) {
            sendUnauthorized(res, "User not found.");
            return;
          }
          (req as any).currentUser = user;
          next();
        } catch (error) {
          console.error("Token verification error:", error);
          sendInternalServerError(res, "Internal server error.");
        }
      }
    });
  } else {
    sendUnauthorized(res, "No token provided.");
  }
};
