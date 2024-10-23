import { JoliboxSDK } from "@jolibox/sdk";
import { useEffect } from "react";

const jolibox = new JoliboxSDK({
  loaderConfig: {
    testMode: true,
    // loaderMetadata: {
    //   version: "1.0.0",
    //   syncScriptUrl: "http://localhost:3000/index.iife.js",
    //   asyncScriptUrl: "http://localhost:3000/index.iife.js",
    // },
  },
});

const { ads } = jolibox;
ads.init({ testMode: true, gameId: "G31841342933817143317925877328" });

export const App = () => {
  useEffect(() => {
    ads.adConfig({
      preloadAdBreaks: "on",
      sound: "on",
      onReady: () => {
        console.log("onReady");
      },
    });

    ads.adUnit({
      el: "#testads",
      slot: "5530307740",
    });
  }, []);

  const preroll = () => {
    ads.adBreak({
      type: "preroll",
      adBreakDone: () => {
        console.log("adBreakDone");
      },
    });
  };

  const insertial = () => {
    ads.adBreak({
      type: "browse",
      adBreakDone: () => {
        console.log("adBreakDone");
      },
    });
  };

  const reward = () => {
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
  };

  return (
    <div>
      <div>
        <button onClick={preroll}>Test preroll</button>
        <button onClick={insertial}>Test Insertial</button>
        <button onClick={reward}>Test reward</button>
        <div id="testads" style={{ width: "500px", height: "300px" }}></div>
      </div>
    </div>
  );
};
