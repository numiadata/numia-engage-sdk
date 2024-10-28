import type { SentEvent } from "./base-event";
import type { Transport } from "./core/fetch-transport";
import {
  runMiddlewares,
  type MiddlewareFunction,
} from "./core/run-middlewares";

type AnalyticsOptions = {
  transport: Transport;
  storage: Storage;
  middlewares: MiddlewareFunction[];
};

export class Analytics {
  private readonly transport: Transport;
  private readonly storage: Storage;
  private readonly middlewares: MiddlewareFunction[];

  constructor(options: AnalyticsOptions) {
    this.transport = options.transport;
    this.storage = options.storage;
    this.middlewares = options.middlewares;
  }

  private async sendEvent(event: SentEvent): Promise<{ success: boolean }> {
    try {
      const finalEvent = await runMiddlewares(
        this.middlewares,
        { storage: this.storage },
        event
      );
      await this.transport.sendEvent(finalEvent);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Failed to send analytics event:", error);
      return {
        success: false,
      };
    }
  }

  public track(name: string, attributes: Record<string, unknown>) {
    return this.sendEvent({
      name,
      attributes,
      timestamp: Date.now(),
    });
  }

  public page(attributes?: Record<string, unknown>) {
    return this.sendEvent({
      name: "page",
      attributes: attributes || {},
      timestamp: Date.now(),
    });
  }

  public identify(id: string, traits: Record<string, unknown>) {
    return this.sendEvent({
      name: "identify",
      attributes: {
        id,
        traits,
      },
      timestamp: Date.now(),
    });
  }

  public alias(newIdentity: string) {
    return this.sendEvent({
      name: "alias",
      attributes: { newIdentity },
      timestamp: Date.now(),
    });
  }
}
