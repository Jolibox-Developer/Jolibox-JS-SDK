import { JoliboxSDKPipeExecutor } from "..";
import { getGameSessionId } from "../utils/session";
import { EventType } from "./event";
import { EventTracker } from "./track";
import { onFCP, onLCP, onTTFB } from "web-vitals";

type AppEvent = "OpenGame" | "PlayGame" | "CloseGame";

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
  private context?: JoliboxSDKPipeExecutor;

  constructor(context?: JoliboxSDKPipeExecutor, config?: IAnalyticsInitParams) {
    this.trackPerformance();

    this.context = context;
    const timeout = config?.appEvent?.interval ?? 10000;
    this.postAppEvent("OpenGame");
    this.interval = window.setInterval(() => {
      this.postAppEvent("PlayGame");
    }, timeout);
  }

  public destroy() {
    window.clearInterval(this.interval);
    this.postAppEvent("CloseGame");
  }

  private getGameId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("gameId") ?? "";
  };

  private getMarketingSource = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("marketingSource") ?? "";
  };

  private trackPerformance = () => {
    onFCP((metric) => {
      this.trackSystemEvent("GameFCP", {
        value: metric.value,
        rating: metric.rating,
        navigationType: metric.navigationType,
      });
    });

    onLCP((metric) => {
      this.trackSystemEvent("GameLCP", {
        value: metric.value,
        rating: metric.rating,
        navigationType: metric.navigationType,
      });
    });

    onTTFB((metric) => {
      this.trackSystemEvent("GameTTFB", {
        value: metric.value,
        rating: metric.rating,
        navigationType: metric.navigationType,
      });
    });
  };

  private postAppEvent(eventType: AppEvent) {
    const gameId = this.getGameId();
    const marketingSource = this.getMarketingSource();
    const sessionId = getGameSessionId();
    this.eventTracker.trackEvent({
      name: eventType,
      type: EventType.System,
      extra: {
        gameId,
        marketingSource,
        sessionId,
      },
    });
  }

  public traceError(
    error: Error,
    extra?: Record<string, string | boolean | number | null> | null
  ) {
    this.eventTracker.trackEvent({
      name: "ErrorTrace",
      type: EventType.ErrorTrace,
      extra: {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack ?? "",
        ...extra,
      },
    });
  }

  public trackSystemEvent(
    eventName: string,
    extra?: Record<string, string | boolean | number | null> | null
  ) {
    this.eventTracker.trackEvent({
      name: eventName,
      type: EventType.System,
      extra,
    });
  }

  public trackEvent(
    eventName: string,
    extra?: Record<string, string | boolean | number | null> | null
  ) {
    this.eventTracker.trackEvent({
      name: eventName,
      type: EventType.UserDefined,
      extra,
    });
  }
}
