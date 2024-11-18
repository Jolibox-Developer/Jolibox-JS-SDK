import { beforeEach, test, vi, expect } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { executor } from "..";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();

  vi.stubGlobal("location", {
    search: "?gameId=G31903729079412278950430008822&marketingSource=google",
  });

  fetchMocker.mockIf(/^https:\/\/test-api.jolibox.com\/public\/ads/, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "SUCCESS",
      data: {
        channelId: "8490678856",
        clientId: "ca-pub-7171363994453626",
        unitId: "5530307740",
      },
    }),
  });
});

test("ads", async () => {
  const ads = executor.ads;
  ads.init();

  await new Promise((resolve) => setTimeout(resolve, 500));

  const adsRequest = fetchMocker
    .requests()
    .find(({ url }) =>
      url.includes("https://test-api.jolibox.com/public/ads")
    )!;

  expect(adsRequest).toBeDefined();
  const objectId = window.encodeURIComponent(
    window.btoa("G31903729079412278950430008822")
  );
  expect(adsRequest.url).toEqual(
    `https://test-api.jolibox.com/public/ads?objectId=${objectId}&marketingSource=google`
  );

  const script = document.head.querySelector("#google-adsense");
  expect(script).not.toBeNull();
  expect(script?.getAttribute("data-ad-channel")).toEqual("8490678856");
});
