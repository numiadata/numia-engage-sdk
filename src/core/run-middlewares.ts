import type { SentEvent } from "../base-event";

// Middleware types
export type MiddlewareNext = () => Promise<void>;
export type MiddlewareFunction = (
  event: SentEvent,
  services: Services,
  next: MiddlewareNext
) => Promise<void>;

export type Services = {
  storage: Storage;
};

export async function runMiddlewares(
  middlewares: MiddlewareFunction[],
  services: Services,
  event: SentEvent
): Promise<SentEvent> {
  let index = 0;
  const next = async () => {
    if (index < middlewares.length) {
      await middlewares[index++](event, services, next);
    }
  };
  await next();
  return event;
}
