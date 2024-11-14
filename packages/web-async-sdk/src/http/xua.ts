import { uuidv4 } from "../utils/uuid";

export const platform = {
  isiOS:
    navigator.userAgent.includes("iPhone") ||
    navigator.userAgent.includes("iPod") ||
    navigator.userAgent.includes("iPad") ||
    navigator.userAgent.includes("iPhone OS"),
  iosVersion: () => {
    const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/) as string[];
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || "0", 10)];
  },
  isAndroid: navigator.userAgent.includes("Android"),
  isMac: navigator.userAgent.includes("Mac"),
  isFacebook: navigator.userAgent.includes("FB_IAB"),
};

export const getAppVersion = () => {
  return window.__JOLIBOX_LOCAL_SDK_VERSION__;
};

// export const getUAParser = () => {
//   const parser = new UAParser();
//   return parser.getResult();
// };

export const DEVICE_ID = "device_id";
export const ADVERTISING_ID = "advertising_id";

export const getStorage = (cookieKey: string) => {
  if (!localStorage.getItem(cookieKey)) {
    localStorage.setItem(cookieKey, uuidv4());
  }
  return localStorage.getItem(cookieKey);
};

export const getDeviceId = () => {
  return getStorage(DEVICE_ID);
};

export const getAdvertisingId = () => {
  return getStorage(ADVERTISING_ID);
};

const firstCharUpperCase = (chars: string) =>
  chars.charAt(0).toUpperCase() + chars.slice(1);

export const getUtmSource = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return firstCharUpperCase(urlParams.get("utm_source") ?? "") || "JoliboxSDK";
};

export const xUserAgent = () => {
  let applicationName = "JoliboxWebSDK";
  const thePlatform = platform.isAndroid
    ? "Android"
    : platform.isiOS
    ? "iOS"
    : "PC";
  const locale = navigator.language;
  const deviceId = getDeviceId();
  const adid = getAdvertisingId();
  const appVersion = getAppVersion();
  //   const parserResult = getUAParser();
  //   const deviceModel = parserResult.device.model;
  const deviceModel = "UnknownModel";
  //   const systemVersion = parserResult.os.version;
  const systemVersion = "UnknownSystemVersion";
  return `${applicationName} (${getUtmSource()}${thePlatform}; ${deviceModel}; ${systemVersion}; ${locale}) uuid/${deviceId} adid/${adid} version/${
    appVersion || ""
  }`;
};
