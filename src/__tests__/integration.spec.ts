import { describe, it, expect } from "bun:test";
import { createEngage } from "../create-engage";
import { fetch } from "bun";

/**
 * HappyDOM fetch connects to https on port 80
 */
globalThis.fetch = fetch;

describe("E2E Tracking things", () => {
  const apiKey = "4TzmfANyA1bRcMrWACToGBqMMiJ0jDXNEzfp6fxUbW1";

  it("Can track page()", async () => {
    const engage = createEngage({
      app: "test",
      apiKey,
    });

    const r = await engage.page();
    expect(r).toHaveProperty("success", true);
  });

  it("Can track track()", async () => {
    const engage = createEngage({
      app: "test",
      apiKey,
    });

    const r = await engage.track("customEvent", {
      foo: "bar",
    });
    expect(r).toHaveProperty("success", true);
  });

  it("Identify", async () => {
    const engage = createEngage({
      app: "test",
      apiKey,
    });

    const r = await engage.identify("user123", {
      name: "John Doe",
      email: "john@example.com",
    });
    expect(r).toHaveProperty("success", true);
  });

  it("Alias", async () => {
    const engage = createEngage({
      app: "test",
      apiKey,
    });

    const r = await engage.alias("newUser456");
    expect(r).toHaveProperty("success", true);
  });
});
