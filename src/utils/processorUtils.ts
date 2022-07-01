import { ProcessorRequest, ProcessorType, Source } from "@openapi/generated";
import { EventFilter, FilterType, ProcessorFormData } from "../types/Processor";
import { isCommaSeparatedFilterType } from "@utils/filterUtils";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

/**
 * Prepare configuration params before reading and writing them.
 * Its only purpose is to manage secret fields and convert to and from
 * their masked value (empty object: {})
 * @param data The configuration params object
 * @param schema The json schema object
 * @param mode "read" when retrieving data, "write" when preparing data for a save request
 * @param [parentKey] Key of the parent configuration parameter used when drilling nested data
 */
export const prepareConfigParameters = (
  data: object,
  schema: object,
  mode: "read" | "write",
  parentKey?: string
): Source["parameters"] => {
  const newParams: { [key: string]: unknown } = {};
  const secretNewValue = (value: unknown): unknown => {
    if (mode === "read") {
      return typeof value === "object" ? "" : value;
    }
    return value === "" ? {} : value;
  };

  Object.keys(data).map((key) => {
    const value = (data as { [key: string]: unknown })[key];
    if (value !== null) {
      if (typeof value === "object" && Object.keys(value).length > 0) {
        newParams[key] = prepareConfigParameters(
          value,
          schema,
          mode,
          parentKey ? `${parentKey}.${key}` : key
        );
      } else {
        if (schema) {
          const def = getSchemaDefinition(
            parentKey ? `${parentKey}.${key}` : key,
            schema
          );
          if (def && isJSONSchema(def)) {
            const { oneOf } = def;
            if (
              oneOf &&
              oneOf.filter(
                (item) => isJSONSchema(item) && item?.format === "password"
              ).length > 0
            ) {
              newParams[key] = secretNewValue(value);
            } else {
              newParams[key] = value;
            }
          } else {
            newParams[key] = value;
          }
        }
      }
    }
  });
  return newParams;
};

/**
 * Prepare processor filters data to be included in a processors API request
 * Filters with invalid or missing properties are excluded from requests
 * @param filters The filters produced by the processors form
 */
export const prepareFilters = (
  filters: Partial<EventFilter>[]
): Partial<EventFilter>[] =>
  filters
    .filter(
      (filter) => filter.type && (filter.value || filter.values) && filter.key
    )
    .map((filter) => {
      if (filter.value && isCommaSeparatedFilterType(filter)) {
        const multipleValuesMapper = (item: string): number | string =>
          filter.type === FilterType.NUMBER_IN
            ? parseFloat(item.trim())
            : item.trim();

        const multipleValuesPredicate =
          filter.type === FilterType.NUMBER_IN
            ? (item: number | string): boolean =>
                item !== null && !isNaN(item as number)
            : String;

        const values = filter.value
          .split(",")
          .map(multipleValuesMapper)
          .filter(multipleValuesPredicate);

        return {
          key: filter.key,
          type: filter.type,
          values,
        };
      }
      return filter;
    })
    .filter(
      (item: Partial<EventFilter>) =>
        item.value || (item.values && item.values.length > 0)
    );

/**
 * Cleanup and prepare processor form data before sending it to an API request
 * @param formData Data coming from the processor form
 * @param isExistingProcessor Flag indicating if it's a new processor or an update
 * @param schema The json-schema of the action/source configuration used in the processor
 */
export const prepareRequest = (
  formData: ProcessorFormData,
  isExistingProcessor: boolean,
  schema: object
): ProcessorRequest => {
  const requestData: ProcessorRequest = { name: formData.name };
  if (formData.type === ProcessorType.Sink) {
    requestData.action =
      isExistingProcessor && formData.action && schema
        ? {
            type: formData.action.type,
            parameters: prepareConfigParameters(
              formData.action.parameters,
              schema,
              "write"
            ),
          }
        : formData.action;
  } else {
    requestData.source =
      isExistingProcessor && formData.source && schema
        ? {
            type: formData.source.type,
            parameters: prepareConfigParameters(
              formData.source.parameters,
              schema,
              "write"
            ),
          }
        : formData.source;
  }
  if (formData.filters && formData.filters.length > 0) {
    const filtersData = prepareFilters(formData.filters) as EventFilter[];
    if (filtersData.length > 0) {
      requestData.filters =
        filtersData as unknown as ProcessorRequest["filters"];
    }
  }
  if (
    formData.transformationTemplate &&
    formData.transformationTemplate.trim().length > 0
  ) {
    requestData.transformationTemplate = formData.transformationTemplate.trim();
  }
  return requestData;
};

/**
 * Retrieve the definition of a specific property inside a json schema
 * @param propertyName Name of the property
 * @param schema Json schema object
 * @param [parentSchema] Parent schema object used when drilling down nested fields
 */
export const getSchemaDefinition = (
  propertyName: string,
  schema: JSONSchema7,
  parentSchema?: JSONSchema7
): JSONSchema7Definition | undefined => {
  if (schema.properties) {
    const propertySplit = propertyName.split(".");
    const currentProperty = propertySplit.shift();

    if (currentProperty) {
      const prop = schema.properties[currentProperty];
      if (typeof prop === "undefined" || !isJSONSchema(prop)) {
        return undefined;
      }
      const definition: JSONSchema7Definition = prop.$ref
        ? resolveReference(prop.$ref, parentSchema ?? schema)
        : prop;

      if (isJSONSchema(definition)) {
        if (definition.type === "object" && definition.properties) {
          return getSchemaDefinition(
            propertySplit.join("."),
            definition,
            schema
          );
        }
        return definition;
      }
    }
  }
  return undefined;
};

/**
 * Check if a json schema definition is a json schema and not a boolean
 * @param value The json schema definition to check
 */
export const isJSONSchema = (
  value: JSONSchema7Definition
): value is JSONSchema7 => {
  return typeof value !== "boolean";
};

/**
 * Simple reference resolver that works with basic references contained in the
 * same schema object
 * @param ref
 * @param schema
 */
export const resolveReference = (
  ref: string,
  schema: JSONSchema7
): JSONSchema7Definition => {
  const allButFirst = ref.split("/");
  allButFirst.shift();
  return allButFirst.reduce(
    (prev, key) =>
      prev && ((prev as { [key: string]: unknown })[key] as JSONSchema7),
    schema
  );
};
