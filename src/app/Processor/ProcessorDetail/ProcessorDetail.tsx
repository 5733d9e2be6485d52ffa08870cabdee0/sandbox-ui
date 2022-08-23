import React, { useEffect, useState } from "react";
import {
  Alert,
  CodeBlock,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { Processor, ProcessorSchemaType } from "../../../types/Processor";
import "./ProcessorDetail.css";
import { getFilterValue } from "@utils/filterUtils";
import {
  ProcessorSchemaEntryResponse,
  ProcessorType,
} from "@rhoas/smart-events-management-sdk";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import ProcessorDetailConfigParameters from "@app/Processor/ProcessorDetail/ProcessorDetailConfigParameters";
import axios from "axios";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";

interface ProcessorDetailProps {
  /** The processor to display */
  processor: Processor;
  /** Catalog of all the actions/sources */
  schemaCatalog: ProcessorSchemaEntryResponse[];
  /** Callback to retrieve a single action/source schema */
  getSchema: GetSchema;
}

const ProcessorDetail = (props: ProcessorDetailProps): JSX.Element => {
  const { processor, schemaCatalog, getSchema } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const [schema, setSchema] = useState<object>();
  const [schemaError, setSchemaError] = useState<string | undefined>();
  const [schemaLoading, setSchemaLoading] = useState(false);

  const sourceOrActionId =
    processor.type === ProcessorType.Source
      ? processor.source.type
      : processor.action.type;

  const processorConfig =
    processor.type === ProcessorType.Source
      ? processor.source.parameters
      : processor.action.parameters;

  const configType =
    processor.type === ProcessorType.Source
      ? ProcessorSchemaType.SOURCE
      : ProcessorSchemaType.ACTION;

  const sourceOrActionName =
    schemaCatalog.find((schema) => schema.id === sourceOrActionId)?.name ?? "";

  useEffect(() => {
    if (processor) {
      setSchemaLoading(true);
      setSchema(undefined);
      setSchemaError(undefined);
      getSchema(sourceOrActionId, configType)
        .then((data) => setSchema(data))
        .catch((error) => {
          if (error && axios.isAxiosError(error)) {
            if (
              isServiceApiError(error) &&
              getErrorCode(error) === APIErrorCodes.ERROR_4
            ) {
              setSchemaError(t("processor.errors.cantFindParametersInfo"));
            } else {
              setSchemaError(
                t("processor.errors.parametersSectionGenericError")
              );
            }
          }
        })
        .finally(() => setSchemaLoading(false));
    }
  }, [processor, getSchema, sourceOrActionId, configType, t]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter={true}>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h2} ouiaId="type">
                {t("processor.processorType")}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Label color={"blue"} data-testid="processor-type-label">
              {t(`processor.${processor.type}`)}
            </Label>
          </StackItem>
        </Stack>
      </PageSection>
      {processor.type === ProcessorType.Source && (
        <PageSection variant={PageSectionVariants.light}>
          <Stack hasGutter={true}>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h2} ouiaId="source-section">
                  {t("processor.source")}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <DescriptionList>
                <DescriptionListGroup key="source-type">
                  <DescriptionListTerm>
                    {t("processor.sourceType")}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {sourceOrActionName}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {schema && !schemaError && !schemaLoading && (
                  <>
                    <ProcessorDetailConfigParameters
                      schema={schema}
                      parameters={processorConfig as { [key: string]: unknown }}
                    />
                  </>
                )}
                {schemaError && (
                  <Alert
                    className="processor-detail__alert"
                    ouiaId="error-schema"
                    variant="danger"
                    title={schemaError}
                    aria-live="polite"
                    isInline
                  />
                )}
              </DescriptionList>
            </StackItem>
          </Stack>
        </PageSection>
      )}
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter={true}>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h2} ouiaId="filters-section">
                {t("processor.filters")}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            {processor.filters?.length ? (
              <TableComposable
                variant={"compact"}
                ouiaId="filters-descriptions"
                borders={true}
                className="processor-detail__filters"
                data-ouia-component-id={"filters"}
              >
                <Thead>
                  <Tr ouiaId="table-head">
                    <Th>{t("common.key")}</Th>
                    <Th>{t("common.type")}</Th>
                    <Th>{t("common.value")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {processor.filters?.map(
                    (filter): JSX.Element => (
                      <Tr key={filter.key} ouiaId={filter.key}>
                        <Td>{filter.key}</Td>
                        <Td>{t(`processor.${filter.type}`)}</Td>
                        <Td>{getFilterValue(filter)}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </TableComposable>
            ) : (
              <TextContent>
                <Text component={TextVariants.p} ouiaId="no-filters">
                  {t("processor.noFilters")}
                </Text>
              </TextContent>
            )}
          </StackItem>
        </Stack>
      </PageSection>
      {processor.type === ProcessorType.Sink && (
        <>
          <PageSection variant={PageSectionVariants.light}>
            <Stack hasGutter={true}>
              <StackItem>
                <TextContent>
                  <Text
                    component={TextVariants.h2}
                    ouiaId="transformation-section"
                  >
                    {t("processor.transformation")}
                  </Text>
                </TextContent>
              </StackItem>
              {processor.transformationTemplate ? (
                <>
                  <StackItem>
                    <TextContent>
                      <Text
                        component={TextVariants.p}
                        ouiaId="transformation-template"
                      >
                        {t("processor.transformationTemplate")}
                      </Text>
                    </TextContent>
                  </StackItem>
                  <StackItem>
                    <CodeBlock className="processor-detail__transformation-template">
                      <CodeBlockCode>
                        {processor.transformationTemplate}
                      </CodeBlockCode>
                    </CodeBlock>
                  </StackItem>
                </>
              ) : (
                <StackItem>
                  <TextContent>
                    <Text component={TextVariants.p} ouiaId="no-transformation">
                      {t("processor.noTransformationTemplate")}
                    </Text>
                  </TextContent>
                </StackItem>
              )}
            </Stack>
          </PageSection>
          <PageSection variant={PageSectionVariants.light}>
            <Stack hasGutter={true}>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.h2} ouiaId="action-section">
                    {t("processor.action")}
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <DescriptionList>
                  <DescriptionListGroup key="action-type">
                    <DescriptionListTerm>
                      {t("processor.actionType")}
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      {sourceOrActionName}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  {schema && !schemaLoading && (
                    <>
                      <ProcessorDetailConfigParameters
                        schema={schema}
                        parameters={
                          processorConfig as { [key: string]: unknown }
                        }
                      />
                    </>
                  )}
                  {schemaError && (
                    <Alert
                      className="processor-detail__alert"
                      ouiaId="error-schema"
                      variant="danger"
                      title={schemaError}
                      aria-live="polite"
                      isInline
                    />
                  )}
                </DescriptionList>
              </StackItem>
            </Stack>
          </PageSection>
        </>
      )}
    </>
  );
};

export default ProcessorDetail;
