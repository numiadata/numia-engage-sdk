import { describe, it, expect, afterEach, beforeAll, mock } from "bun:test";
import assert from "node:assert";
import { createEngage } from "../create-engage";
import type { SentEvent } from "../base-event";

const mockFetch = mock();

describe("Engage", () => {
  beforeAll(() => {
    global.fetch = mockFetch;
  });
  afterEach(() => {
    mockFetch.mockReset();
    document.location.href = "http://numia.xyz";
    window.localStorage.clear();
  });

  describe("Tracking Functions", () => {
    it("Can track page()", async () => {
      const engage = createEngage({
        app: "test",
        apiKey: "12345",
      });
      mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

      await engage.page();
      const event = getLastEvent();

      expect(event).toHaveProperty("name", "page");
      expect(event).toHaveProperty("attributes");
      const now = Date.now();
      expect(now - event.timestamp).toBeLessThan(100);
    });

    it("Can track track()", async () => {
      const engage = createEngage({
        app: "test",
        apiKey: "12345",
      });
      mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

      await engage.track("customEvent", {
        foo: "bar",
      });

      const event = getLastEvent();
      expect(event).toHaveProperty("name", "customEvent");
      expect(event).toHaveProperty("attributes", {
        foo: "bar",
      });
      const now = Date.now();
      expect(now - event.timestamp).toBeLessThan(100);
    });

    it("Can track identify()", async () => {
      const engage = createEngage({
        app: "test",
        apiKey: "12345",
      });
      mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

      await engage.identify("user123", {
        name: "John Doe",
        email: "john@example.com",
      });

      const event = getLastEvent();
      expect(event).toHaveProperty("name", "identify");
      expect(event).toHaveProperty("attributes", {
        id: "user123",
        traits: {
          name: "John Doe",
          email: "john@example.com",
        },
      });
      const now = Date.now();
      expect(now - event.timestamp).toBeLessThan(100);
    });

    it("Can track alias()", async () => {
      const engage = createEngage({
        app: "test",
        apiKey: "12345",
      });
      mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

      await engage.alias("newUser456");

      const event = getLastEvent();
      expect(event).toHaveProperty("name", "alias");
      expect(event).toHaveProperty("attributes", {
        newIdentity: "newUser456",
      });
      const now = Date.now();
      expect(now - event.timestamp).toBeLessThan(100);
    });
  });

  describe("Middleware", () => {
    describe("Enrich", () => {
      it("app", async () => {
        const engage = createEngage({
          app: "test",
          apiKey: "12345",
        });
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

        await engage.page();
        const event = getLastEvent();
        expect(event).toHaveProperty("meta.app", "test");
      });

      it("Campaign", async () => {
        document.location.href =
          "http://numia.xyz/landing?utm_campaign=test&utm_source=email&utm_medium=social&utm_content=banner&utm_term=sale&utm_custom=special";
        const engage = createEngage({
          app: "test",
          apiKey: "12345",
        });
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

        await engage.page();
        const event = getLastEvent();
        expect(event.meta?.campaign).toEqual({
          campaign: "test",
          source: "email",
          medium: "social",
          content: "banner",
          term: "sale",
          custom: "special",
        });
      });

      it("Page", async () => {
        const domain = "http://numia.xyz";
        const path = "/landing";
        const search =
          "?utm_campaign=test&utm_source=email&utm_medium=social&utm_content=banner&utm_term=sale&utm_custom=special";
        const url = `${domain}${path}${search}`;
        document.title = "Numia Landing";
        document.location.href = url;
        const engage = createEngage({
          app: "test",
          apiKey: "12345",
        });
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

        await engage.page();
        const event = getLastEvent();

        expect(event.meta?.page).toEqual({
          path,
          search,
          title: "Numia Landing",
          url,
          referrer: "",
        });
      });

      it("Browser", async () => {
        const engage = createEngage({
          app: "test",
          apiKey: "12345",
        });
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

        await engage.page();
        const event = getLastEvent();
        expect(event.meta?.browser).toEqual({
          userAgent:
            "Mozilla/5.0 (X11; Darwin arm64) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0",
          screenWidth: 1024,
          screenHeight: 768,
          language: "en-US",
          platform: "X11; Darwin arm64",
          locale: "en-US",
          timezone: "UTC",
        });
      });
    });

    describe("Identity", () => {
      it("Defaults a new anonymousId", async () => {
        const engage = createEngage({
          app: "test",
          apiKey: "12345",
        });
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

        await engage.page();
        const event = getLastEvent();
        expect(event.anonymousId).toBeDefined();
      });

      it("AnonymousId is stored in localStorage", async () => {
        const engage1 = createEngage({
          app: "test",
          apiKey: "12345",
        });
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));

        await engage1.page();
        const event = getLastEvent();
        expect(event.anonymousId).toBeDefined();
        const anonymousId = event.anonymousId;
        assert(anonymousId);

        const engage2 = createEngage({
          app: "test",
          apiKey: "12345",
        });
        await engage2.page();
        const event2 = getLastEvent(2);
        expect(event2.anonymousId).toEqual(anonymousId);
      });

      it("Can authenticate via identify", async () => {
        const engage = createEngage({
          app: "test",
          apiKey: "12345",
        });
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));
        await engage.identify("user123", {
          name: "John Doe",
          email: "john@example.com",
        });

        await engage.page();
        const event = getLastEvent(2);
        expect(event.userId).toEqual("user123");
        expect(event.anonymousId).toBeDefined();

        const engage2 = createEngage({
          app: "test",
          apiKey: "12345",
        });
        await engage2.page();
        const event2 = getLastEvent(3);
        expect(event2.userId).toEqual("user123");
      });
    });
  });
});

function getLastEvent(expectedCalls = 1) {
  const calls = mockFetch.mock.calls;
  expect(calls.length).toEqual(expectedCalls);
  const lastCall = calls[calls.length - 1];
  const init = lastCall[1];
  return JSON.parse(init.body) as SentEvent;
}
