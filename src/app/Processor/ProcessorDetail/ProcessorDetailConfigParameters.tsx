import React from "react";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Popover,
} from "@patternfly/react-core";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { useTranslation } from "react-i18next";

interface ProcessorDetailConfigParametersProps {
  schema: JSONSchema7;
  parameters: { [key: string]: unknown };
}

const ProcessorDetailConfigParameters = (
  props: ProcessorDetailConfigParametersProps
): JSX.Element => {
  const { schema, parameters } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <>
      <DescriptionList>
        {schema.properties &&
          Object.entries(schema.properties)
            .filter(([key, value]) => {
              // Processors property shouldn't be here.
              // To be removed after https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/pull/834
              if (key === "processors") {
                return false;
              }
              // Keeping objects and arrays only if they are a data_shape
              if (
                isJSONSchema(value) &&
                value.type &&
                typeof value.type === "string" &&
                ["object", "array"].includes(value.type)
              ) {
                if (key === "data_shape" && parameters[key]) {
                  return true;
                }
                return false;
              }
              return true;
            })
            .map(([key, value]) => {
              if (isJSONSchema(value)) {
                return (
                  <DescriptionListGroup key={key}>
                    {displayFieldName(key, value.title, value.description)}
                    {displayFieldValue(
                      key,
                      schema.properties?.[key] ?? {},
                      parameters[key],
                      t
                    )}
                  </DescriptionListGroup>
                );
              }
              return <></>;
            })}
      </DescriptionList>
    </>
  );
};

export default ProcessorDetailConfigParameters;

const displayFieldName = (
  key: string,
  title?: string,
  description?: string
): JSX.Element => {
  const name = title ?? key.replace("_", " ");
  const cssClass = !title ? "processor-detail__derived-title" : "";

  if (description) {
    return (
      <DescriptionListTermHelpText>
        <Popover bodyContent={description}>
          <DescriptionListTermHelpTextButton className={cssClass}>
            {name}
          </DescriptionListTermHelpTextButton>
        </Popover>
      </DescriptionListTermHelpText>
    );
  }
  return <DescriptionListTerm className={cssClass}>{name}</DescriptionListTerm>;
};

const displayFieldValue = (
  propertyKey: string,
  propertyDefinition: JSONSchema7Definition,
  value: unknown,
  t: (key: string) => string
): JSX.Element => {
  if (isJSONSchema(propertyDefinition)) {
    const { type, oneOf } = propertyDefinition;

    const noPropertySet = (): JSX.Element => (
      <DescriptionListDescription
        className={"processor-detail__property--not-set"}
      >
        {t("processor.propertyNotConfigured")}
      </DescriptionListDescription>
    );

    switch (type) {
      case "object":
        if (propertyKey === "data_shape") {
          return <DataShape data={value as DataShapeValue} />;
        }
        if (value) {
          return (
            <DescriptionListDescription>
              {JSON.stringify(value)}
            </DescriptionListDescription>
          );
        }
        return noPropertySet();
      case "boolean":
        if (value !== undefined) {
          return (
            <DescriptionListDescription>
              {value ? t("common.yes") : t("common.no")}
            </DescriptionListDescription>
          );
        }
        return noPropertySet();
      case "string":
        if (value !== undefined) {
          return (
            <DescriptionListDescription>
              {value as string}
            </DescriptionListDescription>
          );
        }
        return noPropertySet();
      case "number":
      case "integer":
        if (value !== undefined) {
          return (
            <DescriptionListDescription>
              {value as number}
            </DescriptionListDescription>
          );
        }
        return noPropertySet();
      default:
        if (typeof oneOf !== "undefined") {
          const passwordField = oneOf.filter(
            (item) => typeof item !== "boolean" && item?.format === "password"
          );
          if (passwordField && typeof value === "string") {
            return (
              <DescriptionListDescription>{value}</DescriptionListDescription>
            );
          }
        }
        return noPropertySet();
    }
  }
  return <></>;
};

export const DataShape = ({ data }: { data: DataShapeValue }): JSX.Element => {
  return (
    <>
      {Object.keys(data).map((key) => {
        return (
          <DescriptionListDescription key={key}>
            {data?.[key]?.format}
          </DescriptionListDescription>
        );
      })}
    </>
  );
};

interface DataShapeValue {
  [key: string]: {
    format: string;
  };
}

const isJSONSchema = (value: JSONSchema7Definition): value is JSONSchema7 => {
  return typeof value !== "boolean";
};
