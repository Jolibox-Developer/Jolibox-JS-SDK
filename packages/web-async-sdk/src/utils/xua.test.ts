import { expect, test } from "vitest";
import { xUserAgent } from "./xua";
import { isValidUUIDV4 } from "../utils/uuid";

test("xua", () => {
  window.__JOLIBOX_LOCAL_SDK_VERSION__ = "1.0.0";
  const xua = xUserAgent();
  const deviceInfoRegex = /.* (\(.*\) ).*/;
  const deviceInfoMatch = xua.match(deviceInfoRegex);
  const deviceInfo = deviceInfoMatch?.[1] ?? "";
  const rest = xua.replace(deviceInfo, "");
  expect(deviceInfo).toBe(
    "(JoliboxSDKPC; UnknownModel; UnknownSystemVersion; en-US) "
  );

  const [appName, uuidPart, adidPart, versionPart] = rest.split(" ");
  const uuid = uuidPart.split("/")[1];
  const adid = adidPart.split("/")[1];
  const version = versionPart.split("/")[1];
  expect(appName).toBe("JoliboxWebSDK");
  expect(uuidPart.startsWith("uuid/")).toBe(true);
  expect(adidPart.startsWith("adid/")).toBe(true);
  expect(versionPart.startsWith("version/")).toBe(true);
  expect(isValidUUIDV4(uuid)).toBe(true);
  expect(isValidUUIDV4(adid)).toBe(true);
  expect(version).toBe("1.0.0");
});
