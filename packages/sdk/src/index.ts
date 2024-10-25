import "./loader";
import "./ads";
import "@jolibox/web-sync-sdk";
import type { JoliboxSDKLoader, IJoliboxSDKLoaderConfig } from "./loader";
import type { JoliboxAds } from "./ads";
import type { JoliboxRuntime } from "./runtime";

declare global {
  interface Window {
    __JOLIBOX_LOCAL_SDK_VERSION__: string;
    joliboxenv?: {
      testMode: boolean;
      apiBaseURL: string;
    };
    joliboxsdk: JoliboxSDK & { _commandPipe: ICommandPipe[] };
    JoliboxSDK: typeof JoliboxSDK;
  }
  interface ImportMeta {
    env: {
      JOLIBOX_SDK_VERSION: string;
    };
  }
}

window.__JOLIBOX_LOCAL_SDK_VERSION__ = import.meta.env.JOLIBOX_SDK_VERSION;

export interface IJoliboxConfig {
  useRuntimeSDK?: boolean;
  loaderConfig?: IJoliboxSDKLoaderConfig;
  testMode?: boolean;
  apiBaseURL?: string;
}

interface ICommandPipe {
  cmd: string;
  params: any;
}

class JoliboxSDK {
  private loader: JoliboxSDKLoader;
  ads: JoliboxAds;
  runtime: JoliboxRuntime;

  setJoliboxEnv = (inputTestMode?: boolean, inputApiBaseURL?: string) => {
    const isBrowser = typeof window !== "undefined";
    const urlSearchParams = isBrowser
      ? new URLSearchParams(window.location.search)
      : null;
    const testModeParam = urlSearchParams?.get("testMode") === "true";
    const testMode = inputTestMode ?? testModeParam;

    const apiBaseURLParam = urlSearchParams?.get("apiBaseURL");
    let apiBaseURL;
    if (inputApiBaseURL) {
      apiBaseURL = inputApiBaseURL;
    } else if (apiBaseURLParam) {
      apiBaseURL = apiBaseURLParam;
    } else {
      apiBaseURL = testMode
        ? "https://test-api.jolibox.com"
        : "https://api.jolibox.com";
    }
    window.joliboxenv = {
      testMode,
      apiBaseURL,
    };
  };

  constructor({
    useRuntimeSDK = true,
    loaderConfig,
    testMode,
    apiBaseURL,
  }: IJoliboxConfig = {}) {
    this.setJoliboxEnv(testMode, apiBaseURL);
    if (useRuntimeSDK && window.joliboxsdk) {
      this.loader =
        window.joliboxsdk.loader ?? new window.JoliboxSDKLoader(loaderConfig);
      this.ads = window.joliboxsdk.ads ?? new window.JoliboxAds();
      this.runtime = window.joliboxsdk.runtime ?? new window.JoliboxRuntime();
    } else {
      this.loader = new window.JoliboxSDKLoader(loaderConfig);
      this.ads = new window.JoliboxAds();
      this.runtime = new window.JoliboxRuntime();
      window.joliboxsdk = Object.assign(
        this,
        { _commandPipe: [] },
        window.joliboxsdk
      );
    }
    if (!window.joliboxsdk._commandPipe) {
      window.joliboxsdk._commandPipe = [];
    }
  }
}

if (!window.JoliboxSDK) {
  window.JoliboxSDK = JoliboxSDK;
}

export default JoliboxSDK;
export { JoliboxSDK };
