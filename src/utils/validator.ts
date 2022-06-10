import { ValidateFunction } from "ajv";
import Ajv2019 from "ajv/dist/2019";

import ajv from "ajv-errors";

const ajvInstance = new Ajv2019({
  allErrors: true,
  useDefaults: false,
  strict: "log",
  strictSchema: false,
});

ajv(ajvInstance);

export function createValidator(schema: object): CreateValidator {
  const validator = ajvInstance.compile(schema);

  return (model: object) => {
    validator(model);
    return validator.errors?.length ? { details: validator.errors } : null;
  };
}

interface CreateValidator {
  (model: object): { details: ValidateFunction["errors"] } | null;
}
