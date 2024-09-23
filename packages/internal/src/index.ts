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
  window.__JOLIBOX__ = window.__JOLIBOX__ ?? {};
  window.__JOLIBOX__.internal = window.__JOLIBOX__.internal ?? {};
  window.__JOLIBOX__.internal.googleAds =
    window.__JOLIBOX__.internal.googleAds ?? {};
}

export class JoliboxInternal {
  static init = async (gameId: string) => {
    if (typeof window === "undefined") {
      return;
    }
    let clientId = "ca-pub-7171363994453626";
    let channelId: string | undefined;
    try {
      // TODO: implement this
      const clientInfoResp = await fetch(
        `https://openapi.jolibox.com/api/v1/ads/client/${gameId}`
      );
      const clientInfo = await clientInfoResp.json();
      clientId = clientInfo.data.clientId;
      channelId = clientInfo.data.channelId;
    } catch (e) {}
    window.__JOLIBOX__.internal.googleAds.clientId = clientId;
    window.__JOLIBOX__.internal.googleAds.channelId =
      channelId ?? "testChannel";
  };
}

export default JoliboxInternal;
