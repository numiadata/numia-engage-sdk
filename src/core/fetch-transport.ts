import type { SentEvent } from "../base-event";
import { retryFetch, type RetryOptions } from "../util/retry-fetch";

export interface Transport {
  sendEvent(event: SentEvent): Promise<unknown>;
}

interface FetchTransportOptions {
  url: string;
  apiKey: string;
  retryOptions?: RetryOptions;
}

export function createFetchTransport(
  options: FetchTransportOptions
): Transport {
  const { url, apiKey, retryOptions } = options;
  const sendEvent = (event: SentEvent) =>
    retryFetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(event),
        keepalive: true,
      },
      retryOptions
    );
  return { sendEvent };
}
