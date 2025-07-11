// import type { NextFunction, Request, Response } from "express";

// import { vi } from "vitest";

// import { getFilteringOptions, getRequestOptions } from "../helpers/request.js";
// import {
//   sendBadRequest,
//   sendCreated,
//   sendForbidden,
//   sendInternalServerError,
//   sendNotFound,
//   sendSuccess,
//   sendUnauthorized,
//   setHeadersForCORS,
// } from "../helpers/response.js";

// describe("response Helpers", () => {
//   let mockResponse: Partial<Response>;

//   beforeEach(() => {
//     mockResponse = {
//       status: vi.fn().mockReturnThis(),
//       send: vi.fn(),
//       header: vi.fn(),
//     };
//   });

//   it("sendSuccess should send 200 status with data", () => {
//     const testData = { message: "Success" };

//     sendSuccess(mockResponse as Response, testData);

//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.send).toHaveBeenCalledWith(testData);
//   });

//   it("sendCreated should send 201 status with data", () => {
//     const testData = { message: "Created" };

//     sendCreated(mockResponse as Response, testData);

//     expect(mockResponse.status).toHaveBeenCalledWith(201);
//     expect(mockResponse.send).toHaveBeenCalledWith(testData);
//   });

//   it("sendBadRequest should send 400 status with error message", () => {
//     const message = "Bad request";

//     sendBadRequest(mockResponse as Response, message);

//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.send).toHaveBeenCalledWith({
//       success: false,
//       message,
//     });
//   });

//   it("sendUnauthorized should send 401 status with error message", () => {
//     const message = "Unauthorized";

//     sendUnauthorized(mockResponse as Response, message);

//     expect(mockResponse.status).toHaveBeenCalledWith(401);
//     expect(mockResponse.send).toHaveBeenCalledWith({
//       success: false,
//       message,
//     });
//   });

//   it("sendForbidden should send 403 status with default message", () => {
//     sendForbidden(mockResponse as Response);

//     expect(mockResponse.status).toHaveBeenCalledWith(403);
//     expect(mockResponse.send).toHaveBeenCalledWith({
//       success: false,
//       message: "You do not have rights to access this resource.",
//     });
//   });

//   it("sendNotFound should send 404 status with default message", () => {
//     sendNotFound(mockResponse as Response);

//     expect(mockResponse.status).toHaveBeenCalledWith(404);
//     expect(mockResponse.send).toHaveBeenCalledWith({
//       success: false,
//       message: "Resource not found.",
//     });
//   });

//   it("sendInternalServerError should send 500 status with error message", () => {
//     const message = "Internal server error";

//     sendInternalServerError(mockResponse as Response, message);

//     expect(mockResponse.status).toHaveBeenCalledWith(500);
//     expect(mockResponse.send).toHaveBeenCalledWith({
//       success: false,
//       message,
//     });
//   });

//   it("setHeadersForCORS should set CORS headers", () => {
//     const mockRequest = {} as Request;
//     const mockNext = vi.fn() as NextFunction;

//     setHeadersForCORS(mockRequest, mockResponse as Response, mockNext);

//     expect(mockResponse.header).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*");
//     expect(mockResponse.header).toHaveBeenCalledWith(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept",
//     );
//     expect(mockNext).toHaveBeenCalled();
//   });
// });

// describe("request Helpers", () => {
//   it("getRequestOptions should return combined pagination and sorting options", () => {
//     const mockRequest = {
//       query: {
//         page: "2",
//         pageSize: "20",
//         sort: "name",
//         order: "desc",
//       },
//     } as unknown as Request<any, any, any, { page: string; pageSize: string; search: string; sort: string; order: string }>;

//     const options = getRequestOptions(mockRequest);

//     expect(options).toHaveProperty("page");
//     expect(options).toHaveProperty("limit"); // The helper returns 'limit', not 'pageSize'
//     expect(options).toHaveProperty("sort");
//     // Note: The sorting helper doesn't return 'order', only 'sort'
//     expect(options.page).toBe(2);
//     expect(options.limit).toBe(20);
//     expect(options.sort).toBe("name");
//   });

//   it("getFilteringOptions should return filtered query parameters", () => {
//     const mockRequest = {
//       query: {
//         name: "John",
//         age: "25",
//         city: "New York",
//         unwanted: "should not appear",
//       },
//     };

//     const parameters = ["name", "age", "city"];
//     const options = getFilteringOptions(mockRequest, parameters);

//     expect(options).toEqual({
//       name: "John",
//       age: "25",
//       city: "New York",
//     });
//     expect(options).not.toHaveProperty("unwanted");
//   });

//   it("getFilteringOptions should handle missing parameters", () => {
//     const mockRequest = {
//       query: {
//         name: "John",
//       },
//     };

//     const parameters = ["name", "age", "city"];
//     const options = getFilteringOptions(mockRequest, parameters);

//     expect(options).toEqual({
//       name: "John",
//     });
//   });
// });
