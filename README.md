# Jolibox SDK

[Documentation](https://sdk-docs.jolibox.com/)

## Ads SDK

Jolibox SDK module that enables you earn money from Ads. For the current version, we simply wrap the Google Ad Sense and Ads for Game.

Most functions are strictly follow Ad Placement API design. You can read Google's official documentations [here](https://developers.google.com/ad-placement)

**The current version is still in pre-release, so the API may change in the future.**

- Install the SDK via NPM

  ```bash
  npm install @jolibox/ads
  ```

- Alternatively, you can use the library via CDN

  ```html
  <script src="https://cdn.jsdelivr.net/npm/@jolibox/ads-sdk@0.0.7/dist/index.iife.js"></script>
  ```

- Documentation

  [Ads SDK](./packages/ads/README.md)

## Runtime SDK (WIP)

**Still work in progress, please do not use this SDK yet.**

Jolibox SDK module that enables you interact with the Jolibox runtime

- Install the SDK

  ```bash
  npm install @jolibox/runtime
  ```

- Documentation

  [Runtime SDK](./packages/runtime/README.md)
