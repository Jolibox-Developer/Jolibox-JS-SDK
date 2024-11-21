declare global {
  interface Window {
    JoliboxAnalytics: typeof JoliboxAnalytics;
  }
}

export class JoliboxAnalytics {
  constructor() {}

  public trackEvent = (
    eventName: string,
    extra?: Record<string, string | boolean | number | null> | null
  ) => {
    // assert eventName is a string
    if (typeof eventName !== "string") {
      throw new Error("eventName must be a string");
    }

    // assert extra is an object or null or undefined
    if (extra !== null && typeof extra !== "object" && extra !== undefined) {
      throw new Error("extra must be an object or null or undefined");
    }

    // assert extra has no nested objects
    if (extra) {
      for (const key in extra) {
        if (typeof extra[key] === "object") {
          throw new Error("extra must not have nested objects");
        }
      }
    }

    window.joliboxsdk._commandPipe.push({
      cmd: "analytics.trackEvent",
      params: [eventName, extra],
    });
  };
}

window.JoliboxAnalytics = JoliboxAnalytics;

export default JoliboxAnalytics;
