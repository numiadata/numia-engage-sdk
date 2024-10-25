import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register({
  url: "http://numia.xyz",
  settings: {
    navigator: {
      // Need to hardcode, due to difference local and in CI
      userAgent:
        "Mozilla/5.0 (X11; Darwin arm64) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0",
    },
  },
});
