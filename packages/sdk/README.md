# Jolibox Ads SDK

Jolibox SDK module that enables you earn money from Ads. For the current version, we simply wrap the Google Ad Sense and Ads for Game.

Most functions are strictly follow Ad Placement API design. You can read Google's official documentations [here](https://developers.google.com/ad-placement)

**The current version is still in pre-release, so the API may change in the future.**

## Installation

### Via CDN

If you want to use the library via CDN, you add the following script tag to your HTML file.

In such case, you should not write the import statement in your JavaScript file.

```html
<script src="https://cdn.jsdelivr.net/npm/@jolibox/ads-sdk@0.0.7/dist/index.iife.js"></script>
```

### Via NPM

If you want to use the library via NPM, you can install it via the following command:

In such case, you should not include the script tag in your HTML file but write the import statement in your JavaScript file.

- npm

  ```bash
  npm install @jolibox/ads-sdk
  ```

- pnpm

  ```bash
  pnpm add @jolibox/ads-sdk
  ```

- yarn

  ```bash
  yarn add @jolibox/ads-sdk
  ```

## Basic usage

- Initialization

  ```typescript
  // If you are importing the library via NPM, you can use the following import statement
  // import { JoliboxAds } from "@jolibox/ads-sdk";

  const ads = new JoliboxAds({ testMode: true });

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
