import type { MiddlewareFunction } from "../core/run-middlewares";

export function createIdentityMiddleware(): MiddlewareFunction {
  let anonymousId: string;
  let initialized = false;
  let userId: string | undefined;

  return async (event, services, next) => {
    function getAnonymousId() {
      if (!anonymousId) {
        const fromStorage = services.storage.getItem("anonymousId");
        anonymousId = fromStorage || crypto.randomUUID();
        if (!fromStorage) {
          services.storage.setItem("anonymousId", anonymousId);
        }
      }
      return anonymousId;
    }

    if (!initialized) {
      userId = services.storage.getItem("userId") ?? undefined;
      initialized = true;
    }

    if (event.name === "identify" && typeof event.attributes.id === "string") {
      userId = event.attributes.id;
      services.storage.setItem("userId", userId);
    }

    event.anonymousId = getAnonymousId();
    if (userId) {
      event.userId = userId;
    }
    await next();
  };
}
