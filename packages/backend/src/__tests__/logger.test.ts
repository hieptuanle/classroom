import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import winston from "winston";

import logger from "../libs/logger";

// Mock winston before importing logger
const mockWrite = vi.fn();
const mockConsoleTransport = {
  write: mockWrite,
  log: mockWrite,
};

vi.mock("winston", async () => {
  const actual = await vi.importActual("winston") as any;
  return {
    ...actual,
    transports: {
      ...actual.transports,
      Console: vi.fn().mockImplementation(() => mockConsoleTransport),
      File: vi.fn().mockImplementation(() => ({
        write: vi.fn(),
        log: vi.fn(),
      })),
    },
  };
});

describe("logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Enable logger for testing
    logger.silent = false;
  });

  afterEach(() => {
    // Disable logger to prevent test interference
    logger.silent = true;
  });

  it("should be a winston logger instance", () => {
    expect(logger).toBeInstanceOf(winston.Logger);
  });

  it("should have correct log levels", () => {
    expect(logger.levels).toEqual({
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    });
  });

  it("should have the correct log level based on environment", () => {
    // In test environment, should be info level
    expect(logger.level).toBe("info");
  });

  it("should be able to log at different levels", () => {
    // Test that we can call different log methods without errors
    expect(() => logger.info("Test info message")).not.toThrow();
    expect(() => logger.error("Test error message")).not.toThrow();
    expect(() => logger.warn("Test warning message")).not.toThrow();
    expect(() => logger.debug("Test debug message")).not.toThrow();
    expect(() => logger.http("Test HTTP message")).not.toThrow();
  });

  it("should handle structured logging", () => {
    const testData = { userId: 123, action: "login" };
    expect(() => logger.info("User action", testData)).not.toThrow();
  });

  it("should export stream for Morgan", async () => {
    const { stream } = await import("../libs/logger");
    expect(stream).toBeDefined();
    expect(typeof stream.write).toBe("function");
  });

  it("should create logs directory structure", () => {
    const logsDir = path.join(process.cwd(), "logs");
    expect(fs.existsSync(logsDir)).toBe(true);
  });
});
