import { load } from "js-yaml";

const yamlToJson = (value: string): unknown => {
  return load(value);
};

export { yamlToJson };
