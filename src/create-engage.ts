import { Analytics } from "./analytics";
import { createFetchTransport } from "./core/fetch-transport";
import { createLocalStorage } from "./core/storage-localstorage";
import { createEnrichMetaMiddleware } from "./middleware/enrich-meta";
import { createIdentityMiddleware } from "./middleware/identity";

interface EngageOptions {
  app: string;
  apiKey: string;
  test?: boolean;
}

export function createEngage(options: EngageOptions) {
  const { apiKey, test, app } = options;
  const isTest = process.env.NODE_ENV === "test";
  const baseUrl =
    isTest || test
      ? "https://engage-api.staging.numia.xyz"
      : "https://engage-api.numia.xyz";

  const storage = createLocalStorage({ prefix: "num" });
  const transport = createFetchTransport({
    url: `${baseUrl}/sdk/track`,
    apiKey,
  });
  const engage = new Analytics({
    storage,
    transport,
    middlewares: [
      createEnrichMetaMiddleware({ app }),
      createIdentityMiddleware(),
    ],
  });

  return engage;
}
