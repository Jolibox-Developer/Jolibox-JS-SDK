import JoliboxAds from "@jolibox/ads-sdk";
import JoliboxInternal from "@jolibox/internal";
import { useEffect, useMemo, useState } from "react";

export const App = () => {
  const [ads, setAds] = useState<JoliboxAds>();
  const ready = useMemo(() => !!ads, [ads]);

  useEffect(() => {
    // JoliboxInternal is called in jolibox side
    JoliboxInternal.init("gameId").then(() => {
      // Content provider will call create to initialize an ads sdk
      const ads = JoliboxAds.create({ testMode: true });
      setAds(ads);
    });
  }, []);

  const preroll = () => {
    ads?.adBreak({
      type: "preroll",
      adBreakDone: () => {
        console.log("adBreakDone");
      },
    });
  };

  const insertial = () => {
    ads?.adBreak({
      type: "browse",
      adBreakDone: () => {
        console.log("adBreakDone");
      },
    });
  };

  const reward = () => {
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
  };

  return (
    <div>
      {ready ? (
        <div>
          <button onClick={preroll}>Test preroll</button>
          <button onClick={insertial}>Test Insertial</button>
          <button onClick={reward}>Test reward</button>
        </div>
      ) : (
        "Not ready"
      )}
    </div>
  );
};
