export { default } from "react-monaco-editor";

import { SchemasSettings, setDiagnosticsOptions } from "monaco-yaml";

import schema from "./camelDSLSchema.json";

const defaultSchema: SchemasSettings = {
  uri: "http://example.com/schema-name.json",
  fileMatch: ["*"],
  schema,
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
setDiagnosticsOptions({
  enableSchemaRequest: true,
  hover: true,
  completion: true,
  validate: true,
  format: true,
  schemas: [defaultSchema],
});
