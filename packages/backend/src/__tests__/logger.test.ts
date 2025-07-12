import { describe, expect, it } from "vitest";
import winston from "winston";

import logger from "../libs/logger";

describe("logger", () => {
  it("should be a winston logger instance", () => {
    expect(logger).toBeInstanceOf(winston.Logger);
  });

  it("should be able to log at different levels", () => {
    // Test that we can call different log methods without errors
    expect(() => logger.info("Test info message")).not.toThrow();
    expect(() => logger.error("Test error message")).not.toThrow();
    expect(() => logger.warn("Test warning message")).not.toThrow();
  });

  it("should export stream for Morgan", async () => {
    const { stream } = await import("../libs/logger");
    expect(stream).toBeDefined();
    expect(typeof stream.write).toBe("function");
  });
});
