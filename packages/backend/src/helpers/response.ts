import type { NextFunction, Request, Response } from "express";

export function sendSuccess(res: Response, data: any) {
  return res.status(200).send(data);
}

export function sendCreated(res: Response, data: any) {
  return res.status(201).send(data);
}

export function sendBadRequest(res: Response, message: string = "Bad Request") {
  return res.status(400).send({
    success: false,
    message,
  });
}

export function sendUnauthorized(res: Response, message: string = "Unauthorized") {
  return res.status(401).send({
    success: false,
    message,
  });
}

export function sendForbidden(res: Response, message: string = "You do not have rights to access this resource") {
  return res.status(403).send({
    success: false,
    message,
  });
}

export function sendNotFound(res: Response, message: string = "Resource not found") {
  return res.status(404).send({
    success: false,
    message,
  });
}

export function sendInternalServerError(res: Response, message: string = "Internal Server Error") {
  return res.status(500).send({
    success: false,
    message,
  });
}

export function setHeadersForCORS(_req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept",
  );
  next();
}

export default {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendInternalServerError,
};
