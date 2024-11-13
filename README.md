# Jolibox SDK

Jolibox SDK is a JavaScript library that provides a simple way to integrate with Jolibox Ads, Runtime, and other services.

**The current version is still in pre-release, so the API may change in the future.**

## Installation

We recommend using the SDK via CDN so that you can automatically get updates in future SDK versions.

### Via CDN

If you want to use the library via CDN, you add the following script tag to your HTML file.

In such case, you should not write the import statement in your JavaScript file.

```html
<script src="https://cdn.jsdelivr.net/npm/@jolibox/sdk@1/dist/index.iife.js"></script>
```

### Via NPM

If you want to use the library via NPM, you can install it via the following command:

In such case, you should not include the script tag in your HTML file but write the import statement in your JavaScript file.

- npm

  ```bash
  npm install @jolibox/sdk
  ```

- pnpm

  ```bash
  pnpm add @jolibox/sdk
  ```

- yarn

  ```bash
  yarn add @jolibox/sdk
  ```

## Basic usage

- Initialization

  ```typescript
  // If you are importing the library via NPM, you can use the following import statement
  // import { JoliboxSDK } from "@jolibox/sdk";

  const jolibox = new JoliboxSDK();

  // For example, if you want to use the Ads service
  const { ads } = jolibox;
  ads.init();

  // somewhere when you need to preload ads (e.g. in the game loading screen)
  ads.adConfig({
    preloadAdBreaks: "on",
    sound: "on",
    onReady: () => {
      console.log("onReady");
    },
  });

  // Somewhere when you need a popup ads for reward
  ads.adBreak({
    type: "reward",
    beforeReward(showAdFn) {
      showAdFn();
    },
    adDismissed: () => {
      console.log("adDismissed");
    },
    adViewed: () => {
      console.log("adViewed");
    },
    adBreakDone: () => {
      console.log("adBreakDone");
    },
  });

  // If you need to show a banner ad, you should call the following function when you start the App
  ads.adUnit({
    el: "#banner", // or document.getElementById("banner")
  });
  ```
