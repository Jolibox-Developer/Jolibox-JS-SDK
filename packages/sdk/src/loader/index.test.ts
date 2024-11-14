import createFetchMock from "vitest-fetch-mock";
import { test, expect, vi } from "vitest";
import { JoliboxSDKLoader } from ".";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

fetchMocker.mockIf(
  "https://api.jolibox.com/frontend/js-sdk/loader-metadata",
  (req) => {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: "SUCCESS",
        data: {
          version: "1.2.3",
          syncScriptUrl:
            "https://cdn.jsdelivr.net/npm/@jolibox/web-sync-sdk@1/dist/index.iife.js",
          asyncScriptUrl:
            "https://cdn.jsdelivr.net/npm/@jolibox/web-async-sdk@1/dist/index.iife.js",
        },
      }),
    };
  }
);

test("loader working with beta version", () => {
  window.__JOLIBOX_LOCAL_SDK_VERSION__ = "1.2.3-beta+1";
  const loader = new JoliboxSDKLoader();
  expect(loader.loaderMetadata.version).toBe("1.2.3-beta+1");
  expect(loader.loaderMetadata.syncScriptUrl).toBe(
    "https://cdn.jsdelivr.net/npm/@jolibox/web-sync-sdk@1/dist/index.iife.js"
  );
  expect(loader.loaderMetadata.asyncScriptUrl).toBe(
    "https://cdn.jsdelivr.net/npm/@jolibox/web-async-sdk@1/dist/index.iife.js"
  );
});

test("loader working with stable version", () => {
  window.__JOLIBOX_LOCAL_SDK_VERSION__ = "1.2.3";
  const loader = new JoliboxSDKLoader();
  expect(loader.loaderMetadata.version).toBe("1.2.3");
  expect(loader.loaderMetadata.syncScriptUrl).toBe(
    "https://cdn.jsdelivr.net/npm/@jolibox/web-sync-sdk@1/dist/index.iife.js"
  );
  expect(loader.loaderMetadata.asyncScriptUrl).toBe(
    "https://cdn.jsdelivr.net/npm/@jolibox/web-async-sdk@1/dist/index.iife.js"
  );
});
