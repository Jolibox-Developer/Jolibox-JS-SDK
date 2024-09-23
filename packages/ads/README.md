# Jolibox Ads SDK

Jolibox SDK module that enables you earn money from Ads. For the current version, we simply wrap the Google Ad Sense and Ads for Game.

Most functions are strictly follow Ad Placement API design. You can read Google's official documentations [here](https://developers.google.com/ad-placement)

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
  const ads = JoliboxAds.create({ testMode: true });

  // Somewhere when you need a popup ads for reward
  ads?.adBreak({
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
  ```
