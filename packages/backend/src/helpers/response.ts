import { Response, Request, NextFunction } from "express";

export const sendSuccess = (res: Response, data: any) => {
	return res.status(200).send(data);
};

export const sendCreated = (res: Response, data: any) => {
	return res.status(201).send(data);
};

export const sendBadRequest = (res: Response, message: string) => {
	return res.status(400).send({
		success: false,
		message: message,
	});
};

export const sendUnauthorized = (res: Response, message: string) => {
	return res.status(401).send({
		success: false,
		message: message,
	});
};

export const sendForbidden = (res: Response) => {
	return res.status(403).send({
		success: false,
		message: "You do not have rights to access this resource.",
	});
};

export const sendNotFound = (res: Response) => {
	return res.status(404).send({
		success: false,
		message: "Resource not found.",
	});
};

export const sendInternalServerError = (res: Response, message: string) => {
	return res.status(500).send({
		success: false,
		message: message,
	});
};

export const setHeadersForCORS = (_req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, X-Access-Token, Content-Type, Accept"
	);
	next();
};

export default {
	sendSuccess,
	sendCreated,
	sendBadRequest,
	sendUnauthorized,
	sendForbidden,
	sendNotFound,
	sendInternalServerError,
};
