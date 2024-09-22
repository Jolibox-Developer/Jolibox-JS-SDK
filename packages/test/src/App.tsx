import JoliboxAds from "@jolibox/ads-sdk";
import { useEffect, useState } from "react";

export const App = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    JoliboxAds.create({
      gameId: "gameId",
      testMode: true,
    }).then(() => {
      setReady(true);
    });
  }, []);

  const preroll = () => {
    const ads = JoliboxAds.getInstance();
    ads.adBreak({
      type: "preroll",
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
        </div>
      ) : (
        "Not ready"
      )}
    </div>
  );
};
