import { SchemasSettings, setDiagnosticsOptions } from "monaco-yaml";
import schema from "./camelDSLSchema.json";
export { default } from "react-monaco-editor";

const defaultSchema: SchemasSettings = {
  uri: "http://console.redhat.com/docs",
  fileMatch: ["*"],
  schema,
};

setDiagnosticsOptions({
  enableSchemaRequest: true,
  hover: true,
  completion: true,
  validate: true,
  format: true,
  schemas: [defaultSchema],
});
