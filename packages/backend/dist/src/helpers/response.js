export function sendSuccess(res, data) {
    return res.status(200).send(data);
}
export function sendCreated(res, data) {
    return res.status(201).send(data);
}
export function sendBadRequest(res, message = "Bad Request") {
    return res.status(400).send({
        success: false,
        message,
    });
}
export function sendUnauthorized(res, message = "Unauthorized") {
    return res.status(401).send({
        success: false,
        message,
    });
}
export function sendForbidden(res, message = "You do not have rights to access this resource") {
    return res.status(403).send({
        success: false,
        message,
    });
}
export function sendNotFound(res, message = "Resource not found") {
    return res.status(404).send({
        success: false,
        message,
    });
}
export function sendInternalServerError(res, message = "Internal Server Error") {
    return res.status(500).send({
        success: false,
        message,
    });
}
export function setHeadersForCORS(_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept");
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
