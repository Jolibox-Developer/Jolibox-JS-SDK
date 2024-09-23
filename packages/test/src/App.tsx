import JoliboxAds from "@jolibox/ads-sdk";
import { useEffect, useState } from "react";

export const App = () => {
  const [ready, setReady] = useState(false);
  const [ads, setAds] = useState<JoliboxAds>();

  useEffect(() => {
    JoliboxAds.create({
      gameId: "gameId",
      testMode: true,
    }).then((ads) => {
      setAds(ads);
      setReady(true);
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
