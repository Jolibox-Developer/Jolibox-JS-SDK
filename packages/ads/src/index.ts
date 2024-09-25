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
    };
  }
}

if (typeof window !== "undefined") {
  window.__JOLIBOX__ = window.__JOLIBOX__ ?? {
    internal: {
      googleAds: {},
    },
  };
  window.__JOLIBOX__.internal = window.__JOLIBOX__.internal ?? {
    googleAds: {},
  };
  window.__JOLIBOX__.internal.googleAds =
    window.__JOLIBOX__.internal.googleAds ?? {};
}

export interface IAdsInitParams {
  /**
   * Enable "data-adbreak-test" attributes
   */
  testMode?: boolean;

  /**
   * Game ID provided by Jolibox
   */
  gameId?: string;
}

export interface IAdConfigParams {
  /**
   * (OPTIONAL) Whether ads should always be preloaded before the first call to adBreak()
   *
   * The default value of auto leaves the decision up to the Ad Placement API. preloadAdBreaks can be set only once with adConfig(), and further values passed to preloadAdBreaks have no effect.
   *
   * Setting preloadAdBreaks after the first call to adBreak() has no effect.
   */
  preloadAdBreaks: "on" | "auto"; // default: 'auto'

  /**
   * (OPTIONAL) Whether the game is currently playing sound.
   *
   * This call specifies whether your game is capable of sound, and whether the sound was enabled (ie unmuted) before the call to adBreak(). This helps the Ad Placement API to select the right kind of ad for your game.
   *
   * Call this function as soon as the sound state of your game changes, as the Ad Placement API may have to request new creatives, and this gives it the maximum amount of time to do so.
   *
   * The default value is sound on. So most games will need to make a call to adConfig() when they start to declare that they have sound enabled.
   */
  sound: "on" | "off"; // default: 'on'

  /**
   * (OPTIONAL) Called when the API has initialized and has finished preloading ads (if you requested preloading using the preloadAdBreaks above).
   * @returns
   */
  onReady: () => void;
}

/**
 * PlacementInfo object passed by **adBreakDone** function
 */
export interface IPlacementInfo {
  /**
   * the type argument passed to adBreak()
   */
  breakType: string;
  /**
   * the name argument passed to adBreak()
   */
  breakName: string;
  breakFormat: "interstitial" | "reward";
  /**
   * the status of this placement and can be one of the following values:
   *
   * | breakStatus | Reason |
   * | -------- | ------- |
   * | 'notReady'	| The Ad Placement API had not initialised |
   * | 'timeout' | A placement timed out because the Ad Placement API took too long to respond |
   * | 'invalid' | The placement was invalid and was ignored–for instance there should only be one preroll placement per page load, subsequent prerolls are failed with this status |
   * | 'error' | There was a JavaScript error in a callback |
   * | 'noAdPreloaded' |	An ad had not been preloaded yet so this placement was skipped |
   * | 'frequencyCapped' |	An ad wasn't shown because the frequency cap was applied to this placement |
   * | 'ignored' |	The user didn't click on a reward prompt before they reached the next placement, that is showAdFn() wasn't called before the next adBreak(). |
   * | 'other' |	The ad was not shown for another reason. (e.g., The ad was still being fetched, or a previously cached ad was disposed because the screen was resized/rotated.) |
   * | 'dismissed' |	The user dismissed a rewarded ad before viewing it to completion |
   * | 'viewed' |	The ad was viewed by the user |
   */
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

/**
 * Parameter when calling adBreak
 */
export type IAdBreakParams =
  | IPrerollParams
  | IInterstitialsParams
  | IRewardParams;

/**
 * Parameter when calling preroll type adBreak
 */
export interface IPrerollParams {
  /**
   * 'preroll' before the game loads (before UI has rendered)
   */
  type: "preroll";

  /**
   * (OPTIONAL) Always called as the last step in an adBreak(), even if there was no ad shown. Function takes as argument a placementInfo object
   * @param placementInfo
   * @returns
   */
  adBreakDone?: (placementInfo: IPlacementInfo) => void;
}

export interface IInterstitialsParams {
  /**
   * 'start' before the gameplay starts (after UI has rendered)
   * 'pause' the player pauses the game
   * 'next' player navigates to the next level
   * 'browse' the player explores options outside of the gameplay
   */
  type: "start" | "pause" | "next" | "browse" | "reward";

  /**
   * (OPTIONAL) a name for this particular ad placement within your game. It is an internal identifier, and is not shown to the player. In future releases this identifier may be used to enable additional reporting and optimization features.
   *
   * We recommend you name all of your placements.
   */
  name?: string;

  /**
   * (OPTIONAL) Called before the ad is displayed. The game should pause and mute the sound. These actions must be done synchronously. The ad will be displayed immediately after this callback finishes.
   *
   * @returns
   */
  beforeAd?: () => void;

  /**
   *
   * @returns (OPTIONAL) Called after the ad is finished (for any reason). For rewarded ads, it is called after either adDismissed or adViewed, depending on player actions. This function should be used to resume game flow. For example, use to unmute the sound and start the next level.
   */
  afterAd?: () => void;

  /**
   * (OPTIONAL) Always called as the last step in an adBreak(), even if there was no ad shown. Function takes as argument a placementInfo object
   *
   * @param placementInfo
   * @returns
   */
  adBreakDone?: (placementInfo: IPlacementInfo) => void;
}

export interface IRewardParams {
  /**
   * 'reward' a rewarded ad
   */
  type: "reward";

  /**
   * (OPTIONAL) a name for this particular ad placement within your game. It is an internal identifier, and is not shown to the player. In future releases this identifier may be used to enable additional reporting and optimization features.
   *
   * We recommend you name all of your placements.
   */
  name?: string;

  /**
   * (OPTIONAL) Called before the ad is displayed. The game should pause and mute the sound. These actions must be done synchronously. The ad will be displayed immediately after this callback finishes.
   * @returns
   */
  beforeAd?: () => void;

  /**
   * (OPTIONAL) Called after the ad is finished (for any reason). For rewarded ads, it is called after either adDismissed or adViewed, depending on player actions. This function should be used to resume game flow. For example, use to unmute the sound and start the next level.
   * @returns
   */
  afterAd?: () => void;

  /**
   * (OPTIONAL) Always called as the last step in an adBreak(), even if there was no ad shown. Function takes as argument a placementInfo object defined
   * @param placementInfo
   * @returns
   */
  adBreakDone?: (placementInfo: IPlacementInfo) => void;

  /**
   * Called if a rewarded ad is available. The function should take a single argument–showAdFn() which must be called to display the rewarded ad.
   * @param showAdFn
   * @returns
   */
  beforeReward: (showAdFn: () => void) => void;

  /**
   * Called only for rewarded ads when the player dismisses the ad. It is only called if the player dismisses the ad before it completes. In this case the reward should not be granted.
   * @returns
   */
  adDismissed: () => void;

  /**
   * Called only for rewarded ads when the player completes the ad and should be granted the reward.
   * @returns
   */
  adViewed: () => void;
}

/**
 * Jolibox Ads SDK
 */
export class JoliboxAds {
  private configured = false;
  public clientId?: string;
  public channelId?: string;

  /**
   * Create a new instance of JoliboxAds. The constructor will automatically load the Google Adsense script.
   * @param config
   * @returns
   */
  constructor(config: IAdsInitParams) {
    if (typeof window === "undefined") {
      this.clientId = "";
      this.channelId = "";
      return;
    }

    window.adsbygoogle = window.adsbygoogle || [];
    this.asyncInit(config);
  }

  /**
   * Internal function to load Google Adsense script in async
   * @param config
   * @returns
   */
  private asyncInit = async (config: IAdsInitParams) => {
    if (typeof window === "undefined") {
      return;
    }

    let clientId = "ca-pub-7171363994453626";
    let channelId: string | undefined;
    try {
      // TODO: implement this
      const clientInfoResp = await fetch(
        `https://openapi.jolibox.com/api/v1/ads/client/${config.gameId}`
      );
      const clientInfo = await clientInfoResp.json();
      clientId = clientInfo.data.clientId;
      channelId = clientInfo.data.channelId;
    } catch (e) {}

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

    this.clientId = clientId;
    this.channelId = channelId ?? "";
  };

  /**
   * Internal function to push adsbygoogle array
   * @param params
   */
  private push = (params: any = {}) => {
    window.adsbygoogle.push(params);
  };

  /**
   * The adConfig() call communicates the game's current configuration to the Ad Placement API. The Ad Placement API can use this to tune the way it preloads ads and to filter the kinds of ads it requests so they're suitable (eg. video ads that require sound).
   * @param params
   */
  public adConfig = (params: IAdConfigParams) => {
    if (!this.configured) {
      this.configured = true;
      this.push(params);
    } else {
      console.warn("Ad config already set, skipping");
    }
  };

  /**
   * adBreak() is the key function for placing ads within your game. It defines an ad placement and takes an object called a placement config that specifies everything required to show an ad.
   *
   * The adBreak() function defines a placement where an ad could be shown. Whether an ad actually shows depends on factors such as the following:
   *
   * - The type of ad placement that you declared
   *   - Is this ad at the start of the game? Between levels? At a moment when the player has paused the game?
   * - Whether a suitable ad exists for the current player
   *   - Is this ad relevant to them?
   *   - Is it consistent with their data privacy and consent settings?
   * - The number of ads the player has seen recently
   * - The control settings—for example, ad frequency, you've configured for this game
   *   - Either as hints in the tag, or,
   *   - Within AdSense—note that the controls available in AdSense will evolve over time.
   *
   * The kind of ad that shows also depends on similar factors.
   *
   * Note that a call to adBreak() might not show an ad at all. It simply declares a place where an ad could be shown.
   *
   * This is unlike traditional APIs in which your code always knows if an ad is available, and you decide within the game whether to show it. This approach of letting the Ad Placement API decide if an ad shows in a particular placement is a pattern that is sometimes referred to as "inversion of control".
   *
   * The reason we're transitioning our games API to this model is firstly, it shortens the code you have to write within your game. Secondly, it makes it easier to deliver policy compliant placements with a great user experience, which in turn has allowed us to deliver some of our highest performing formats to games publishers. Lastly, it more cleanly separates the process of placing ads in your game from the monetization decisions about the type and number of ads to show.
   *
   * We want you to be able to change your monetization settings and control the user experience without having to edit and release a new version of your game, initially by specifying hints in the tag. But in future releases, we will be able to provide controls directly in the AdSense and AdMob frontends.
   * @param params
   */
  public adBreak = (params: IAdBreakParams) => {
    this.push(params);
  };
}

export default JoliboxAds;
