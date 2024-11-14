# Installation

```bash
 # npm
 npm install @numia/engage-sdk

 # yarn
 yarn add @numia/engage-sdk

 # pnpm
 pnpm add @numia/engage-sdk
```

# Setup

In order to get started with the SDK, you will need to create an instance of the analytics class. For this you need a writeKey from our dashboard:

```typescript
import { createEngage } from "@numia/engage-sdk";

const analytics = createEngage({
  app: "soon-unicorn-app",
  apiKey: "MySecretWriteKey",
  test: true, // remove this for production
});
```

# Usage

## Basic tracking methods

The basic tracking methods below serve as the building blocks of your attribution tracking. They include Identify, Track, Page, and Alias.

### Identify

The Identify method is how you tell Numia which wallet is associated with the events you are tracking. It includes a wallet address, and any optional property you know about them.

You don’t need to call Identify for anonymous visitors or users that have not connected their wallet. Numia automatically assigns them an anonymousId, so just calling page and track works just fine without Identify.

Here’s what a basic call to Identify might look like:

```typescript
analytics.identify("dydx12345678901234567890", {
  // Optional Properties to store with the identified wallet
  wallet: "Metamask",
});
```

### Track

The Track method is how you tell Numia about the actions wallets are performing on your exchange. Every action triggers what's called an "event", which can also have associated properties. You can read more about Track in the track method reference.

Here's what a Track call might look like when a wallet connects to your exchange:

```typescript
analytics.track("Order Placed", {
  market: "BTC-USDC",
  orderId: "1234567890",
  amount: 100,
  currency: "USDC",
});
```

### Page

The Page method lets you record page views on your website, along with optional extra information about the page viewed by the user. This is particular important for attribution, since it tracks the utm parameters even if the user does not connect their wallet or complete any other actions.

The page method follows the format below.

```typescript
analytics.page();
```
