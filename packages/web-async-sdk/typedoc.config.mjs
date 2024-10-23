const readme =
  process.env.DOC_LANG === "zh_cn" ? "README-zh_cn.md" : "README.md";

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  readme,
  projectDocuments: [readme],
  entryPoints: ["src/index.ts"],
  entryPointStrategy: "expand",
  cacheBust: true,
  headings: {
    readme: true,
    document: false,
  },
};

export default config;
