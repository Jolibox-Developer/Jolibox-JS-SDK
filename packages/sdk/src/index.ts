import "./loader";
import "./ads";
import "@jolibox/web-sync-sdk";
import type { JoliboxSDKLoader, IJoliboxSDKLoaderConfig } from "./loader";
import type { JoliboxAds } from "./ads";
import type { JoliboxRuntime } from "@jolibox/web-sync-sdk";

export type { IJoliboxSDKLoaderConfig, IVersionMetadata } from "./loader";
export type * from "./ads";
export type * from "@jolibox/web-sync-sdk";

declare global {
  interface Window {
    __JOLIBOX_LOCAL_SDK_VERSION__: string;
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
}

interface ICommandPipe {
  cmd: string;
  params: any;
}

class JoliboxSDK {
  private loader: JoliboxSDKLoader;
  ads: JoliboxAds;
  runtime: JoliboxRuntime;

  constructor({ useRuntimeSDK = true, loaderConfig }: IJoliboxConfig = {}) {
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
