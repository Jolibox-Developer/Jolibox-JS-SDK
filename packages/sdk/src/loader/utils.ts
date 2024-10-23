const splitSemver = (
  version: string
): {
  major: string;
  minor: string;
  patch: string;
  prerelease?: string;
  build?: string;
} => {
  const prerelease = version.split("-")[1] as string | undefined;
  if (prerelease) {
    version = version.replace(`-${prerelease}`, "");
  }

  const build = version.split("+")[1] as string | undefined;
  if (build) {
    version = version.replace(`+${build}`, "");
  }

  const splitted = version.split(".").slice(0, 3);
  const [major, minor, patch] = [
    splitted[0] ?? "0",
    splitted[1] ?? "0",
    splitted[2] ?? "0",
  ];
  return { major, minor, patch, prerelease, build };
};

export const major = (version: string): number =>
  parseInt(splitSemver(version).major, 10);

export const compare = (v1: string, v2: string): -1 | 0 | 1 => {
  const { major: major1, minor: minor1, patch: patch1 } = splitSemver(v1);
  const { major: major2, minor: minor2, patch: patch2 } = splitSemver(v2);

  if (major1 !== major2) {
    return major1 > major2 ? 1 : -1;
  }

  if (minor1 !== minor2) {
    return minor1 > minor2 ? 1 : -1;
  }

  if (patch1 !== patch2) {
    return patch1 > patch2 ? 1 : -1;
  }

  return 0;
};
