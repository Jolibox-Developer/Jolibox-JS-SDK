import { expect, test } from "vitest";
import { major, compare } from "./utils";

test("semver major is working", () => {
  const version = "1.2.3-beta+1";
  const majorVersion = major(version);
  expect(majorVersion).toBe(1);
});

test("compare semver is working", () => {
  const v1 = "1.2.3-beta+1";
  const v2 = "1.2.4-beta+1";
  const result = compare(v1, v2);
  expect(result).toBe(-1);
});
