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
import { useTranslation } from "@rhoas/app-services-ui-components";
import { DataShapeValue } from "../../../types/Processor";
import { isJSONSchema } from "@utils/processorUtils";

interface ProcessorDetailConfigParametersProps {
  schema: JSONSchema7;
  parameters: { [key: string]: unknown };
}

const ProcessorConfigParameters = (
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
                  <DescriptionListGroup
                    data-ouia-component-type="ProcessorConfig/FormGroup"
                    data-ouia-component-id={key}
                    key={key}
                  >
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

export default ProcessorConfigParameters;

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
          <DescriptionListTermHelpTextButton
            className={cssClass}
            data-testid={key}
          >
            {name}
          </DescriptionListTermHelpTextButton>
        </Popover>
      </DescriptionListTermHelpText>
    );
  }
  return (
    <DescriptionListTerm className={cssClass} data-testid={key}>
      {name}
    </DescriptionListTerm>
  );
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
        data-testid={`${propertyKey}-value`}
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
            <DescriptionListDescription data-testid={`${propertyKey}-value`}>
              {JSON.stringify(value)}
            </DescriptionListDescription>
          );
        }
        return noPropertySet();
      case "boolean":
        if (value !== undefined) {
          return (
            <DescriptionListDescription data-testid={`${propertyKey}-value`}>
              {value ? t("common.yes") : t("common.no")}
            </DescriptionListDescription>
          );
        }
        return noPropertySet();
      case "string":
        if (value !== undefined) {
          return (
            <DescriptionListDescription data-testid={`${propertyKey}-value`}>
              {value as string}
            </DescriptionListDescription>
          );
        }
        return noPropertySet();
      case "number":
      case "integer":
        if (value !== undefined) {
          return (
            <DescriptionListDescription data-testid={`${propertyKey}-value`}>
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
          if (passwordField && value) {
            return (
              <DescriptionListDescription data-testid={`${propertyKey}-value`}>
                {maskedValue}
              </DescriptionListDescription>
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
          <DescriptionListDescription key={key} data-testid="data_shape-value">
            {data?.[key]?.format}
          </DescriptionListDescription>
        );
      })}
    </>
  );
};

export const maskedValue = "**************************";
