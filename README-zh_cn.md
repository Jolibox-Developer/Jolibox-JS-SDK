# Jolibox SDK

[文档](https://sdk-docs.jolibox.com/)

## 广告 SDK

Jolibox SDK 模块使您可以通过广告赚钱。目前版本我们简单地封装了 Google Ad Sense 和 Ads for Game。

大多数功能严格遵循广告投放 API 设计。您可以阅读 Google 的官方文档 [这里](https://developers.google.com/ad-placement)

**当前版本仍处于预发布阶段，因此 API 可能会在未来发生变化。**

- 通过 NPM 安装 SDK

  ```bash
  npm install @jolibox/ads
  ```

- 或者，您可以通过 CDN 使用库

  ```html
  <script src="https://cdn.jsdelivr.net/npm/@jolibox/ads-sdk@0.0.7/dist/index.iife.js"></script>
  ```

- 文档

  [广告 SDK](./packages/ads/README-zh_cn.md)

## 运行时 SDK (WIP)

**仍在进行中，请不要使用此 SDK。**

Jolibox SDK 模块使您可以与 Jolibox 运行时进行交互

- 安装 SDK

  ```bash
  npm install @jolibox/runtime
  ```

- 文档

  [运行时 SDK](./packages/runtime/README.md)
