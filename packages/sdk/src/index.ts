import { JoliboxSDKLoader, type IJoliboxSDKLoaderConfig } from "./loader";
import { JoliboxAds } from "./ads";

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

interface IJoliboxConfig {
  useRuntimeSDK?: boolean;
  loaderConfig?: IJoliboxSDKLoaderConfig;
}

interface ICommandPipe {
  cmd: string;
  params: any;
}

class JoliboxSDK {
  ads: JoliboxAds;
  loader: JoliboxSDKLoader;

  constructor({ useRuntimeSDK = true, loaderConfig }: IJoliboxConfig = {}) {
    if (useRuntimeSDK && window.joliboxsdk) {
      this.loader = window.joliboxsdk.loader;
      this.ads = window.joliboxsdk.ads;
    } else {
      this.loader = new JoliboxSDKLoader(loaderConfig);
      this.ads = new JoliboxAds();
      window.joliboxsdk = Object.assign(this, { _commandPipe: [] });
    }
  }
}

if (!window.JoliboxSDK) {
  window.JoliboxSDK = JoliboxSDK;
}

export default JoliboxSDK;
export { JoliboxSDK };
