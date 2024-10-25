const readme =
  process.env.DOC_LANG === "zh_cn" ? "README-zh_cn.md" : "README.md";

const out = process.env.DOC_LANG === "zh_cn" ? "docs/zh_cn" : "docs/en";

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  readme: readme,
  projectDocuments: [readme],
  entryPoints: ["packages/sdk"],
  entryPointStrategy: "packages",
  includeVersion: true,
  cacheBust: true,
  packageOptions: {},
  plugin: ["typedoc-plugin-localization"],
  out,
};

export default config;
