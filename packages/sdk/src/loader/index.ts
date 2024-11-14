import { major, compare } from "./utils";

declare global {
  interface Window {
    JOLIBOX_ENV: "WEB" | "IOS" | "ANDROID" | "WINDOWS" | "MACOS" | "LINUX";
    JoliboxSDKLoader: typeof JoliboxSDKLoader;
  }
}

const joliboxLoaderKey = "jolibox-sdk-loader-metadata";

export interface IVersionMetadata {
  version: string;
  syncScriptUrl?: string; // By default, the sync script is bundled with the sdk
  asyncScriptUrl?: string;
}

export interface IRemoteVersionMetadata {
  code: "SUCCESS" | string;
  message?: string;
  data?: IVersionMetadata;
}

export interface IJoliboxSDKLoaderConfig {
  loaderMetadata?: IVersionMetadata;
}

export class JoliboxSDKLoader {
  loaderMetadata: IVersionMetadata;

  constructor({ loaderMetadata }: IJoliboxSDKLoaderConfig = {}) {
    console.log("Loading Jolibox SDK...");

    this.loaderMetadata = loaderMetadata ?? this.computeLoaderMetaData();
    this.loadScript();
    this.fetchUpdateLoaderMetadata();
    console.log("Jolibox SDK loaded.");
  }

  private get currentVersion() {
    return window.__JOLIBOX_LOCAL_SDK_VERSION__;
  }

  private get defaultMetadata(): IVersionMetadata {
    const version = this.currentVersion;
    const majorVersion = major(version);
    return {
      version,
      syncScriptUrl: `https://cdn.jsdelivr.net/npm/@jolibox/web-sync-sdk@${majorVersion}/dist/index.iife.js`,
      asyncScriptUrl: `https://cdn.jsdelivr.net/npm/@jolibox/web-async-sdk@${majorVersion}/dist/index.iife.js`,
    };
  }

  computeLoaderMetaData = () => {
    const version = this.currentVersion;
    let loaderMetadata: IVersionMetadata | null = null;
    try {
      loaderMetadata = JSON.parse(
        localStorage.getItem(joliboxLoaderKey) ?? "null"
      ) as IVersionMetadata | null;
      if (!loaderMetadata || !loaderMetadata.version) {
        throw new Error("Invalid loader metadata");
      }
    } catch (error) {
      loaderMetadata = this.defaultMetadata;
    }

    const versionFromLocalStorage = loaderMetadata?.version ?? version;

    if (major(versionFromLocalStorage) !== major(version)) {
      // if major version is different, must follow the version from package.json
      loaderMetadata = this.defaultMetadata;
    } else {
      // if major version is the same, follow the larger version
      if (compare(versionFromLocalStorage, version) < 0) {
        loaderMetadata = this.defaultMetadata;
      }
    }

    return loaderMetadata;
  };

  loadScript = () => {
    if (this.loaderMetadata.syncScriptUrl) {
      // The only way to load a script synchronously is to use XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open("GET", this.loaderMetadata.syncScriptUrl, false);
      xhr.send();
      // eval(xhr.responseText);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = xhr.responseText;
      document.head.appendChild(script);
    }

    if (this.loaderMetadata.asyncScriptUrl) {
      const asyncScript = document.createElement("script");
      asyncScript.type = "text/javascript";
      asyncScript.src = this.loaderMetadata.asyncScriptUrl;
      asyncScript.async = true;
      document.head.appendChild(asyncScript);
    }
  };

  fetchUpdateLoaderMetadata = async (
    installedSDKVersion = this.currentVersion,
    localSDKVersion = this.loaderMetadata.version,
    env = window.JOLIBOX_ENV ?? "WEB"
  ) => {
    const path = `${
      window.joliboxenv?.apiBaseURL ?? "https://api.jolibox.com"
    }/frontend/js-sdk/loader-metadata`;
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          installedSDKVersion,
          localSDKVersion,
          env,
        }),
      });
      const data: IRemoteVersionMetadata = await response.json();
      if (data.code !== "SUCCESS") {
        throw new Error(data.message);
      } else {
        this.loaderMetadata = data.data ?? this.defaultMetadata;
        localStorage.setItem(
          joliboxLoaderKey,
          JSON.stringify(this.loaderMetadata)
        );
        // reload happens next time the page is loaded
      }
    } catch (error) {
      console.warn("Failed to fetch loader metadata: ", error);
    }
  };
}

window.JoliboxSDKLoader = JoliboxSDKLoader;
