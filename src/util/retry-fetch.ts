import pRetry, { AbortError, type Options } from "p-retry";

export type RetryOptions = Options;

export const retryFetch = (
  input: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1],
  options?: Options
): ReturnType<typeof fetch> =>
  pRetry(() => wrappedFetch(input, init), {
    retries: 3,
    ...options,
    // onFailedAttempt(error) {
    //     console.log(
    //         `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
    //     )
    // },
  });

async function wrappedFetch(...args: Parameters<typeof fetch>) {
  // console.log("wrappedFetch", args);
  const res = await fetch(...args);
  if (res.status >= 400) {
    if (!retryStatusCodes.includes(res.status)) {
      //   console.log("Error Body", await res.json());
      throw new AbortError(`Request failed with status code ${res.status}`);
    }
    if (
      typeof args[1] === "object" &&
      args[1].method &&
      !retryMethods.includes(args[1].method)
    ) {
      throw new AbortError(`Request failed with status code ${res.status}`);
    }
    throw Error(`Request failed with status code ${res.status}`);
  }
  return res;
}

// Source: https://github.com/sindresorhus/got/blob/main/documentation/7-retry.md
const retryMethods = ["GET", "PUT", "HEAD", "DELETE", "OPTIONS", "TRACE"];
const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504, 521, 522, 524];
const retryErrorCodes = [
  "ETIMEDOUT",
  "ECONNRESET",
  "EADDRINUSE",
  "ECONNREFUSED",
  "EPIPE",
  "ENOTFOUND",
  "ENETUNREACH",
  "EAI_AGAIN",
];
