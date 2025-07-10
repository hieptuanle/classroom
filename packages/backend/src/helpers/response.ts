import type { NextFunction, Request, Response } from "express";

export function sendSuccess(res: Response, data: any) {
  return res.status(200).send(data);
}

export function sendCreated(res: Response, data: any) {
  return res.status(201).send(data);
}

export function sendBadRequest(res: Response, message: string) {
  return res.status(400).send({
    success: false,
    message,
  });
}

export function sendUnauthorized(res: Response, message: string) {
  return res.status(401).send({
    success: false,
    message,
  });
}

export function sendForbidden(res: Response) {
  return res.status(403).send({
    success: false,
    message: "You do not have rights to access this resource.",
  });
}

export function sendNotFound(res: Response, message?: string) {
  return res.status(404).send({
    success: false,
    message: message || "Resource not found.",
  });
}

export function sendInternalServerError(res: Response, message: string) {
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
