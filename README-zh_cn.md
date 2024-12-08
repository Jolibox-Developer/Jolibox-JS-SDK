# Jolibox SDK

Jolibox SDK 是一个 JavaScript 库，提供了一种简单的方法来集成 Jolibox 广告、运行时和其他服务。

## 安装

我们推荐使用 CDN 引入 SDK，这样可以在未来的 SDK 版本中自动获得更新。

### 通过 CDN 引入

如果你想通过 CDN 使用该库，可以在你的 HTML 文件中添加以下脚本标签。

在这种情况下，你不应该在你的 JavaScript 文件中编写 import 语句。

```html
<script src="https://cdn.jsdelivr.net/npm/@jolibox/sdk@1/dist/index.iife.js"></script>
```

### 通过 NPM 安装

如果你想通过 NPM 使用该库，可以通过以下命令安装它：

在这种情况下，你不应该在你的 HTML 文件中包含脚本标签，而是在你的 JavaScript 文件中编写 import 语句。

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

## 基本用法

- 初始化

  ```typescript
  // 如果你通过 NPM 导入库，你可以使用以下 import 语句
  // import { JoliboxSDK } from "@jolibox/sdk";

  const jolibox = new JoliboxSDK();
  const { ads, runtime } = jolibox;

  // 当你的游戏正在加载时，调用notifyLoadProgress来通知加载进度
  runtime.notifyLoadProgress(30);
  runtime.notifyLoadProgress(60);
  runtime.notifyLoadProgress(90);

  // 当你的游戏加载完成时，调用loadFinished来通知加载完成
  runtime.loadFinished();

  // 在游戏中初始化广告
  ads.init();

  // 在需要预加载广告的地方（例如在游戏加载屏幕中）
  ads.adConfig({
    preloadAdBreaks: "on",
    sound: "off",
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
