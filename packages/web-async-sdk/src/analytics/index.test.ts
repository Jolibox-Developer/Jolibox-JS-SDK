import createFetchMock, { type FetchMock } from "vitest-fetch-mock";
import { test, expect, vi, beforeEach } from "vitest";
import { JoliboxAnalyticsImpl } from ".";
import { isValidUUIDV4 } from "../utils/uuid";
import { EventType } from "./event";

const parseBody = async (request: Request) => {
  const bodyStream = request.body;
  const bodyReader = bodyStream?.getReader();
  const bodyUint8Array = (await bodyReader?.read())?.value;
  return new TextDecoder().decode(bodyUint8Array);
};

const splitRequests = (fetchMocker: FetchMock) => {
  const requests = fetchMocker.requests();
  const appEventRequests = requests.filter(
    ({ url }) => url === "https://api.jolibox.com/api/base/app-event"
  );
  const trackEventRequests = requests.filter(
    ({ url }) => url === "https://stg-collect.jolibox.com/report"
  );
  return { appEventRequests, trackEventRequests };
};

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();

  vi.stubGlobal("location", {
    search: "?gameId=123&marketingSource=google",
  });

  vi.stubGlobal("__JOLIBOX_LOCAL_SDK_VERSION__", "1.2.3");

  fetchMocker.mockResponse(JSON.stringify({ code: "SUCCESS" }));
});

test("create and destroy JoliboxAnalyticsImpl", async () => {
  const analytics = new JoliboxAnalyticsImpl();
  await new Promise((resolve) => setTimeout(resolve, 10));
  const { appEventRequests } = splitRequests(fetchMocker);
  const appEventRequest = appEventRequests[0];
  expect(appEventRequest).toBeDefined();
  const payload = JSON.parse(await parseBody(appEventRequest));

  expect(fetchMocker.requests().length).toEqual(2);
  expect(appEventRequest.url).toEqual(
    "https://api.jolibox.com/api/base/app-event"
  );
  expect(appEventRequest.method).toEqual("POST");
  expect(payload.eventType).toEqual("OPEN_GAME");
  expect(payload.gameInfo.gameId).toEqual("123");
  expect(payload.gameInfo.marketingSource).toEqual("google");
  expect(isValidUUIDV4(payload.gameInfo.sessionId)).toBe(true);

  analytics.destroy();
  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(fetchMocker.requests().length).toEqual(4);
});

test("JoliboxAnalyticsImpl has interval", async () => {
  const analytics = new JoliboxAnalyticsImpl({ appEvent: { interval: 100 } });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  expect(fetchMocker.requests().length).toEqual(20);

  const { appEventRequests, trackEventRequests } = splitRequests(fetchMocker);
  const firstAppEventRequest = appEventRequests[0];
  const secondAppEventRequest = appEventRequests[1];
  const lastAppEventRequest = appEventRequests[9];

  expect(firstAppEventRequest).toBeDefined();
  expect(secondAppEventRequest).toBeDefined();
  expect(lastAppEventRequest).toBeDefined();

  const firstAppEventBody = JSON.parse(await parseBody(firstAppEventRequest));
  const secondAppEventBody = JSON.parse(await parseBody(secondAppEventRequest));
  const lastAppEventBody = JSON.parse(await parseBody(lastAppEventRequest));

  expect(firstAppEventBody.eventType).toEqual("OPEN_GAME");
  expect(secondAppEventBody.eventType).toEqual("PLAY_GAME");
  expect(lastAppEventBody.eventType).toEqual("PLAY_GAME");

  const firstTrackEventRequest = trackEventRequests[0];
  const secondTrackEventRequest = trackEventRequests[1];
  const lastTrackEventRequest = trackEventRequests[9];

  expect(firstTrackEventRequest).toBeDefined();
  expect(secondTrackEventRequest).toBeDefined();
  expect(lastTrackEventRequest).toBeDefined();

  const firstTrackEventPackage = JSON.parse(
    await parseBody(firstTrackEventRequest)
  );
  const secondTrackEventPackage = JSON.parse(
    await parseBody(secondTrackEventRequest)
  );
  const lastTrackEventPackage = JSON.parse(
    await parseBody(lastTrackEventRequest)
  );

  expect(firstTrackEventPackage[1][0][0]).toEqual("OpenGame");
  expect(secondTrackEventPackage[1][0][0]).toEqual("PlayGame");
  expect(lastTrackEventPackage[1][0][0]).toEqual("PlayGame");

  console.log("firstTrackEventPackage", firstTrackEventPackage);
  const firstTrackEventDevice = firstTrackEventPackage[2];
  console.log("firstTrackEventDevice", firstTrackEventDevice);
  const firstTrackEvent = firstTrackEventPackage[1][0];
  console.log("firstTrackEvent", firstTrackEvent);
  const firstTrackEventLocation = firstTrackEvent[2];
  console.log("firstTrackEventLocation", firstTrackEventLocation);
  const firstTrackEventTarget = firstTrackEvent[3];
  console.log("firstTrackEventTarget", firstTrackEventTarget);

  expect(firstTrackEventPackage[0]).toEqual("1.0.0"); // protocolVersion
  expect(firstTrackEvent[1]).toEqual(EventType.System); // event type
  expect(firstTrackEventLocation[0]).toEqual("GamePage"); // event location name
  expect(firstTrackEventLocation[1]).toEqual({
    gameId: "123",
    marketingSource: "google",
  }); // event location extra
  expect(firstTrackEventTarget).toBeNull(); // event target
  expect(firstTrackEvent[4]).toBeNull(); // event extra
  expect(firstTrackEvent[5]).toBeGreaterThan(0); // event timestamp
  expect(firstTrackEvent[6]).toBeNull(); // event userId

  expect(firstTrackEventDevice[0]).toEqual(1000); // device platform
  expect(firstTrackEventDevice[1]).toEqual("PC"); // device os
  expect(firstTrackEventDevice[2]).toEqual("1.2.3"); // device appVersion
  expect(firstTrackEventDevice[3]).toEqual("1"); // device appId
  expect(firstTrackEventDevice[4]).toEqual("UnknownModel"); // device model
  expect(firstTrackEventDevice[5]).toEqual("UnknownBrand"); // device brand
  expect(isValidUUIDV4(firstTrackEventDevice[6])).toBe(true); // device uuid
  expect(firstTrackEventDevice[7]).toEqual("1.2.3"); // device jsSdkVersion
  expect(firstTrackEventDevice[8]).toBeNull(); // device extra

  expect(firstTrackEventPackage[3]).toEqual("web-sdk"); // project

  analytics.destroy();

  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(fetchMocker.requests().length).toEqual(22);

  const closeResponse = splitRequests(fetchMocker).appEventRequests[10];
  const closeBody = JSON.parse(await parseBody(closeResponse));
  expect(closeBody.eventType).toEqual("CLOSE_GAME");
});

test("JoliboxAnalyticsImpl can track event", async () => {
  const analytics = new JoliboxAnalyticsImpl();
  analytics.trackEvent("TestCustomEvent", { extra: "extra" });

  await new Promise((resolve) => setTimeout(resolve, 10));
  const { trackEventRequests } = splitRequests(fetchMocker);
  expect(trackEventRequests.length).toEqual(2);

  const lastEventRequest = trackEventRequests[1];
  const lastEventPackage = JSON.parse(await parseBody(lastEventRequest));

  const lastEvent = lastEventPackage[1][0];
  const lastEventDevice = lastEventPackage[2];
  const lastEventLocation = lastEvent[2];
  const lastEventTarget = lastEvent[3];

  expect(lastEvent[0]).toEqual("TestCustomEvent"); // event name
  expect(lastEvent[1]).toEqual(EventType.UserDefined); // event type
  expect(lastEventLocation[0]).toEqual("GamePage"); // event location name
  expect(lastEventLocation[1]).toEqual({
    gameId: "123",
    marketingSource: "google",
  }); // event location extra
  expect(lastEventTarget).toBeNull(); // event target
  expect(lastEvent[4]).toEqual({ extra: "extra" }); // event extra
  expect(lastEvent[5]).toBeGreaterThan(0); // event timestamp
  expect(lastEvent[6]).toBeNull(); // event userId

  expect(lastEventDevice[0]).toEqual(1000); // device platform
  expect(lastEventDevice[1]).toEqual("PC"); // device os
  expect(lastEventDevice[2]).toEqual("1.2.3"); // device appVersion
  expect(lastEventDevice[3]).toEqual("1"); // device appId
  expect(lastEventDevice[4]).toEqual("UnknownModel"); // device model
  expect(lastEventDevice[5]).toEqual("UnknownBrand"); // device brand
  expect(isValidUUIDV4(lastEventDevice[6])).toBe(true); // device uuid
  expect(lastEventDevice[7]).toEqual("1.2.3"); // device jsSdkVersion
  expect(lastEventDevice[8]).toBeNull(); // device extra

  expect(lastEventPackage[3]).toEqual("web-sdk"); // project
});
