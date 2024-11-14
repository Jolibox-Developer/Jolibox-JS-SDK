import createFetchMock from "vitest-fetch-mock";
import { test, expect, vi, beforeEach } from "vitest";
import { JoliboxAnalyticsImpl } from ".";
import { isValidUUIDV4 } from "../utils/uuid";

const parseBody = async (request: Request) => {
  const bodyStream = request.body;
  const bodyReader = bodyStream?.getReader();
  const bodyUint8Array = (await bodyReader?.read())?.value;
  return new TextDecoder().decode(bodyUint8Array);
};

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();

  vi.stubGlobal("location", {
    search: "?gameId=123&marketingSource=google",
  });

  fetchMocker.mockResponse(JSON.stringify({ code: "SUCCESS" }));
});

test("create and destroy JoliboxAnalyticsImpl", async () => {
  const analytics = new JoliboxAnalyticsImpl();
  await new Promise((resolve) => setTimeout(resolve, 10));
  const request = fetchMocker.requests()[0];
  const payload = JSON.parse(await parseBody(request));

  expect(fetchMocker.requests().length).toEqual(1);
  expect(request.url).toEqual("https://api.jolibox.com/api/base/app-event");
  expect(request.method).toEqual("POST");
  expect(payload.eventType).toEqual("OPEN_GAME");
  expect(payload.gameInfo.gameId).toEqual("123");
  expect(payload.gameInfo.marketingSource).toEqual("google");
  expect(isValidUUIDV4(payload.gameInfo.sessionId)).toBe(true);

  analytics.destroy();
  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(fetchMocker.requests().length).toEqual(2);
  const closeResponse = fetchMocker.requests()[1];
});

test("JoliboxAnalyticsImpl has interval", async () => {
  const analytics = new JoliboxAnalyticsImpl({ interval: 100 });
  await new Promise((resolve) => setTimeout(resolve, 1001));

  expect(fetchMocker.requests().length).toEqual(10);
  const firstRequest = fetchMocker.requests()[0];
  const secondRequest = fetchMocker.requests()[1];
  const lastRequest = fetchMocker.requests()[9];

  expect(firstRequest.url).toEqual(
    "https://api.jolibox.com/api/base/app-event"
  );
  expect(secondRequest.url).toEqual(
    "https://api.jolibox.com/api/base/app-event"
  );
  expect(lastRequest.url).toEqual("https://api.jolibox.com/api/base/app-event");

  const firstBody = JSON.parse(await parseBody(firstRequest));
  const secondBody = JSON.parse(await parseBody(secondRequest));
  const lastBody = JSON.parse(await parseBody(lastRequest));

  expect(firstBody.eventType).toEqual("OPEN_GAME");
  expect(secondBody.eventType).toEqual("PLAY_GAME");
  expect(lastBody.eventType).toEqual("PLAY_GAME");

  analytics.destroy();

  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(fetchMocker.requests().length).toEqual(11);

  const closeResponse = fetchMocker.requests()[10];
  const closeBody = JSON.parse(await parseBody(closeResponse));
  expect(closeBody.eventType).toEqual("CLOSE_GAME");
});
