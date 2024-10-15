# Jolibox Ads SDK

Jolibox SDK module that enables you earn money from Ads. For the current version, we simply wrap the Google Ad Sense and Ads for Game.

Most functions are strictly follow Ad Placement API design. You can read Google's official documentations [here](https://developers.google.com/ad-placement)

**The current version is still in pre-release, so the API may change in the future.**

## Installation

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
  import { JoliboxAds } from "@jolibox/ads-sdk";

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
