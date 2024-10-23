import { JoliboxSDKLoader, type IJoliboxSDKLoaderConfig } from "./loader";
import { JoliboxAds } from "./ads";

declare global {
  interface Window {
    __JOLIBOX_LOCAL_SDK_VERSION__: string;
    joliboxsdk: JoliboxSDK & { _commandPipe: ICommandPipe[] };
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

  constructor(params: IJoliboxConfig = {}) {
    if (params.useRuntimeSDK && window.joliboxsdk) {
      this.loader = window.joliboxsdk.loader;
      this.ads = window.joliboxsdk.ads;
    } else {
      this.loader = new JoliboxSDKLoader(params.loaderConfig);
      this.ads = new JoliboxAds();
      window.joliboxsdk = Object.assign(this, { _commandPipe: [] });
    }
  }
}

export default JoliboxSDK;
export { JoliboxSDK };
