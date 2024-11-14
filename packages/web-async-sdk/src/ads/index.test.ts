import { beforeEach, test, vi, expect } from "vitest";
import JoliboxAdsImpl from ".";
import createFetchMock from "vitest-fetch-mock";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();

  vi.stubGlobal("location", {
    search: "?gameId=G31903729079412278950430008822&marketingSource=google",
  });

  fetchMocker.mockIf(/^https:\/\/api.jolibox.com\/public\/ads/, {
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
  if (!window.joliboxenv) {
    window.joliboxenv = {
      apiBaseURL: "https://api.jolibox.com",
      testMode: true,
    };
  }
  const ads = new JoliboxAdsImpl();
  ads.init();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  expect(fetchMocker.requests().length).toEqual(1);
  const request = fetchMocker.requests()[0];
  const objectId = window.encodeURIComponent(
    window.btoa("G31903729079412278950430008822")
  );
  expect(request.url).toEqual(
    `https://api.jolibox.com/public/ads?objectId=${objectId}&marketingSource=google`
  );

  const script = document.head.querySelector("#google-adsense");
  expect(script).not.toBeNull();
  expect(script?.getAttribute("data-ad-channel")).toEqual("8490678856");
});
