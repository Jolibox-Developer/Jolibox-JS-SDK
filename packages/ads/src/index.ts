declare global {
  interface Window {
    adsbygoogle: any;
    __JOLIBOX__: {
      internal: {
        googleAds: {
          clientId?: string;
          channelId?: string;
        };
      };
      ads?: JoliboxAds;
    };
  }
}

if (typeof window !== "undefined") {
  window.__JOLIBOX__ = window.__JOLIBOX__ || {};
}

export interface IAdsInitParams {
  testMode?: boolean;
}

export interface IAdConfigParams {
  preloadAdBreaks: "on" | "auto"; // default: 'auto'
  sound: "on" | "off"; // default: 'on'
  onReady: () => void;
}

export interface IPlacementInfo {
  breakType: string;
  breakName: string;
  breakFormat: "interstitial" | "reward";
  breakStatus:
    | "notReady"
    | "timeout"
    | "error"
    | "noAdPreloaded"
    | "frequencyCapped"
    | "ignored"
    | "other"
    | "dismissed"
    | "viewed";
}

export type IAdBreakParams =
  | IPrerollParams
  | IInterstitialsParams
  | IRewardParams;

export interface IPrerollParams {
  type: "preroll";
  adBreakDone?: (placementInfo: IPlacementInfo) => void;
}

export interface IInterstitialsParams {
  type: "start" | "pause" | "next" | "browse" | "reward";
  name?: string;
  beforeAd?: () => void;
  afterAd?: () => void;
  adBreakDone?: (placementInfo: IPlacementInfo) => void;
}

export interface IRewardParams {
  type: "reward";
  name?: string;
  beforeAd?: () => void;
  afterAd?: () => void;
  adBreakDone?: (placementInfo: IPlacementInfo) => void;

  // only reward
  beforeReward: (showAdFn: () => void) => void;
  adDismissed: () => void;
  adViewed: () => void;
}

export class JoliboxAds {
  private configured = false;
  public clientId: string;
  public channelId: string;

  constructor(clientId: string, channelId: string) {
    this.clientId = clientId;
    this.channelId = channelId;
  }

  private push = (params: any = {}) => {
    window.adsbygoogle.push(params);
  };

  static getInstance = () => {
    return window.__JOLIBOX__.ads;
  };

  static create = (config: IAdsInitParams) => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.__JOLIBOX__.ads) {
      return window.__JOLIBOX__.ads;
    } else {
      const clientId = window.__JOLIBOX__.internal.googleAds.clientId;
      const channelId = window.__JOLIBOX__.internal.googleAds.channelId;

      if (!clientId || !channelId) {
        throw new Error(
          "Ads SDK not initialized, contact jolibox developer support team"
        );
      }

      const gAdsenseDomId = "google-adsense";
      const testMode = config.testMode || false;
      if (!document.getElementById(gAdsenseDomId)) {
        const script = document.createElement("script");
        script.id = gAdsenseDomId;
        script.async = true;
        script.crossOrigin = "anonymous";
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        if (testMode) {
          script.setAttribute("data-adbreak-test", "on");
        }
        if (channelId) {
          script.setAttribute("data-ad-channel", channelId);
        }
        document.head.appendChild(script);
      }
      window.adsbygoogle = window.adsbygoogle || [];

      const ads = new JoliboxAds(clientId, channelId ?? "");
      window.__JOLIBOX__.ads = ads;
      return ads;
    }
  };

  adConfig = (params: IAdConfigParams) => {
    if (!this.configured) {
      this.configured = true;
      this.push(params);
    } else {
      console.warn("Ad config already set, skipping");
    }
  };

  adBreak = (params: IAdBreakParams) => {
    this.push(params);
  };
}

export default JoliboxAds;
