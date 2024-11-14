// Copy paste examples from readme, to make sure they match the types

import { createEngage } from "../src/index";

const analytics = createEngage({
  app: "soon-unicorn-app",
  apiKey: "MySecretWriteKey",
  test: true, // remove this for production
});

analytics.identify("dydx12345678901234567890", {
  // Optional Properties to store with the identified wallet
  wallet: "Metamask",
});

analytics.track("Order Placed", {
  market: "BTC-USDC",
  orderId: "1234567890",
  amount: 100,
  currency: "USDC",
});

analytics.page();
