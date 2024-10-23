import { major, compare } from "./utils";

declare global {
  interface Window {
    JOLIBOX_ENV: "WEB" | "IOS" | "ANDROID" | "WINDOWS" | "MACOS" | "LINUX";
  }
}

const joliboxLoaderKey = "jolibox-sdk-loader-metadata";

export interface IVersionMetadata {
  version: string;
  syncScriptUrl?: string;
  asyncScriptUrl?: string;
}

interface IRemoteVersionMetadata {
  code: "SUCCESS" | string;
  message?: string;
  data?: IVersionMetadata;
}

export interface IJoliboxSDKLoaderConfig {
  testMode?: boolean;
  loaderMetadata?: IVersionMetadata;
}

export class JoliboxSDKLoader {
  loaderMetadata: IVersionMetadata;
  testMode = false;

  constructor({ testMode, loaderMetadata }: IJoliboxSDKLoaderConfig = {}) {
    console.log("Loading Jolibox SDK...");
    this.testMode = testMode ?? false;
    this.loaderMetadata = loaderMetadata ?? this.computeLoaderMetaData();
    this.loadScript();
    this.fetchUpdateLoaderMetadata();
  }

  private get apiBaseURL() {
    return this.testMode
      ? "https://test-api.jolibox.com"
      : "https://api.jolibox.com";
  }

  private get currentVersion() {
    return window.__JOLIBOX_LOCAL_SDK_VERSION__;
  }

  private get defaultMetadata(): IVersionMetadata {
    const version = this.currentVersion;
    return {
      version,
      // syncScriptUrl: `https://cdn.jsdelivr.net/npm/@jolibox/web-sync-sdk@${version}/dist/index.iife.js`,
      asyncScriptUrl: `https://cdn.jsdelivr.net/npm/@jolibox/web-async-sdk@${version}/dist/index.iife.js`,
    };
  }

  computeLoaderMetaData() {
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
  }

  loadScript = () => {
    if (this.loaderMetadata.syncScriptUrl) {
      const script = document.createElement("script");
      script.src = this.loaderMetadata.syncScriptUrl;
      document.head.appendChild(script);
    }

    if (this.loaderMetadata.asyncScriptUrl) {
      const asyncScript = document.createElement("script");
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
    const path = `${this.apiBaseURL}/frontend/js-sdk/loader-metadata`;
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
