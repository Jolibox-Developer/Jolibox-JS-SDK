import { HttpClient } from "../http";
import { getGameSessionId } from "../utils/session";
import { EventType } from "./event";
import { EventTracker } from "./track";

type AppEvent = "OPEN_GAME" | "PLAY_GAME" | "CLOSE_GAME";
const mapAppEventToTrackEventName = {
  OPEN_GAME: "OpenGame" as const,
  PLAY_GAME: "PlayGame" as const,
  CLOSE_GAME: "CloseGame" as const,
};

interface IAnalyticsInitParams {
  appEvent?: {
    interval?: number;
  };
}

/**
 * Jolibox Analytics Implementation
 *
 * This class is responsible for sending analytics events to the Jolibox backend.
 * Currently, it will only send events in background but not exposed to the public.
 */
export class JoliboxAnalyticsImpl {
  private interval: number;
  private eventTracker = new EventTracker();
  private httpClient = new HttpClient();

  constructor(config?: IAnalyticsInitParams) {
    const timeout = config?.appEvent?.interval ?? 10000;
    this.postAppEvent("OPEN_GAME");
    this.interval = setInterval(() => {
      this.postAppEvent("PLAY_GAME");
    }, timeout);
  }

  public destroy() {
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

  private postAppEvent(eventType: AppEvent) {
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
    this.eventTracker.trackEvent({
      name: mapAppEventToTrackEventName[eventType],
      type: EventType.System,
    });
    this.httpClient.post("/api/base/app-event", { data });
  }

  public trackEvent(
    eventName: string,
    extra: Record<string, string | boolean | number | null> | null
  ) {
    this.eventTracker.trackEvent({
      name: eventName,
      type: EventType.UserDefined,
      extra,
    });
  }
}
