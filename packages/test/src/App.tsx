import JoliboxAds from "@jolibox/ads-sdk";
import { useEffect, useMemo } from "react";

export const App = () => {
  const ads = useMemo(
    () => new JoliboxAds({ testMode: true, gameId: "gameId" }),
    []
  );

  useEffect(() => {
    ads.adConfig({
      preloadAdBreaks: "on",
      sound: "on",
      onReady: () => {
        console.log("onReady");
      },
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
      </div>
    </div>
  );
};
