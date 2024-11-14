import { httpClient } from "../http";
import { getGameSessionId } from "../utils/session";

type EventType = "OPEN_GAME" | "PLAY_GAME" | "CLOSE_GAME";

interface IAnalyticsInitParams {
  interval: number;
}

/**
 * Jolibox Analytics Implementation
 *
 * This class is responsible for sending analytics events to the Jolibox backend.
 * Currently, it will only send events in background but not exposed to the public.
 */
export class JoliboxAnalyticsImpl {
  interval: number;

  constructor(config?: IAnalyticsInitParams) {
    const timeout = config?.interval ?? 10000;
    this.postAppEvent("OPEN_GAME");
    this.interval = setInterval(() => {
      this.postAppEvent("PLAY_GAME");
    }, timeout);
  }

  destroy() {
    clearInterval(this.interval);
    this.postAppEvent("CLOSE_GAME");
  }

  private getGameId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("gameId") ?? "";
  };

  private getMarketingSource = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("marketingSource") ?? "";
  };

  private postAppEvent(eventType: EventType) {
    const gameId = this.getGameId();
    const marketingSource = this.getMarketingSource();
    const sessionId = getGameSessionId();
    const data = {
      eventType,
      gameInfo: {
        gameId,
        marketingSource,
        sessionId,
      },
    };
    return httpClient.post("/api/base/app-event", { data });
  }
}
