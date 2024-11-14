import { expect, test } from "vitest";
import { isValidUUIDV4, uuidv4 } from "./uuid";

test("uuid", () => {
  const uuid = uuidv4();
  expect(uuid.length).toBe(36);
  expect(isValidUUIDV4(uuid)).toBe(true);
});

test("isValidUUIDV4", () => {
  const randomUUIDV4 = "5b1e0b7b-3b3b-4b4b-8b8b-9b9b0b1b2b3b";
  expect(isValidUUIDV4(randomUUIDV4)).toBe(true);
  expect(isValidUUIDV4("")).toBe(false);
});
