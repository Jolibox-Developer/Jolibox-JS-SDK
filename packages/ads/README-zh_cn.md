# Jolibox Ads SDK

Jolibox SDK 模块使您可以通过广告赚钱。在当前版本中，我们简单地封装了 Google Ad Sense 和 Ads for Game。

大多数功能严格遵循广告展示 API 设计。您可以在[这里](https://developers.google.com/ad-placement)阅读 Google 的官方文档。

**当前版本仍处于预发布阶段，因此 API 可能会在未来发生变化。**

## 安装

### 通过 CDN 引入

如果你想通过 CDN 使用该库，可以在你的 HTML 文件中添加以下脚本标签。

在这种情况下，你不应该在你的 JavaScript 文件中编写 import 语句。

```html
<script src="https://cdn.jsdelivr.net/npm/@jolibox/ads-sdk@0.0.8/dist/index.iife.js"></script>
```

### 通过 NPM 安装

如果你想通过 NPM 使用该库，可以通过以下命令安装它：

在这种情况下，你不应该在你的 HTML 文件中包含脚本标签，而是在你的 JavaScript 文件中编写 import 语句。

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

## 基本用法

- 初始化

  ```typescript
  // 如果你通过 NPM 导入库，你可以使用以下 import 语句
  // import { JoliboxAds } from "@jolibox/ads-sdk";

  const ads = new JoliboxAds({ testMode: true });

  // 在需要预加载广告的地方（例如在游戏加载屏幕中）
  ads.adConfig({
    preloadAdBreaks: "on",
    sound: "on",
    onReady: () => {
      console.log("onReady");
    },
  });

  // 在需要弹出奖励广告的地方
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

  // 如果需要显示横幅广告，应在应用启动时调用以下函数
  ads.adUnit({
    el: "#banner", // 或者 document.getElementById("banner")
  });
  ```
