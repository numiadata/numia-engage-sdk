import { describe, expect, it, beforeEach, afterEach, mock } from "bun:test";
import { retryFetch } from "./retry-fetch";
import { AbortError } from "p-retry";

// Mock the global fetch
const originalFetch = global.fetch;
let mockFetch: ReturnType<typeof mock>;

describe("retryFetch", () => {
  beforeEach(() => {
    // Reset mock before each test
    mockFetch = mock(() => {});
    global.fetch = mockFetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  it("should not retry on 401 unauthorized", async () => {
    // Mock fetch to return 401
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized" }),
      })
    );

    // Attempt the fetch
    await expect(retryFetch("/test", {})).rejects.toThrow();

    // Verify fetch was only called once
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should retry on 500 GET server error", async () => {
    // Mock fetch to fail twice with 500, then succeed
    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ message: "Server Error" }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ message: "Server Error" }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ message: "Success" }),
        })
      );

    // Attempt the fetch
    await retryFetch("/test", {});

    // Verify fetch was called multiple times
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("should retry on 500 POST server error", async () => {
    // Mock fetch to fail twice with 500, then succeed
    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ message: "Server Error" }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ message: "Server Error" }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ message: "Success" }),
        })
      );

    // Attempt the fetch
    await retryFetch("/test", {
      method: "POST",
    });

    // Verify fetch was called multiple times
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("should succeed immediately on 200", async () => {
    // Mock fetch to return 200
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ message: "Success" }),
      })
    );

    // Attempt the fetch
    await retryFetch("/test", {});

    // Verify fetch was only called once
    expect(mockFetch.mock.calls.length).toBe(1);
  });
});
