import React from "react";
import {
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
import { Processor } from "../../../types/Processor";
import "./ProcessorDetail.css";

interface ProcessorDetailProps {
  /**
   * The processor to display
   */
  processor: Processor;
}

const ProcessorDetail = (props: ProcessorDetailProps): JSX.Element => {
  const { processor } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter={true}>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h2}>
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
      {processor.type === "source" && (
        <PageSection variant={PageSectionVariants.light}>
          <Stack hasGutter={true}>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h2}>{t("processor.source")}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <DescriptionList>
                <DescriptionListGroup key="source-type">
                  <DescriptionListTerm>
                    {t("processor.sourceType")}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {processor.source.type}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {Object.keys(processor.source.parameters).map(
                  (key): JSX.Element => (
                    <DescriptionListGroup key={key}>
                      <DescriptionListTerm>
                        {t(`processor.${key}`)}
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {processor.source.parameters[key]}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  )
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
              <Text component={TextVariants.h2}>{t("processor.filters")}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            {processor.filters?.length ? (
              <TableComposable
                variant={"compact"}
                borders={true}
                className="processor-detail__filters"
                data-ouia-component-id={"filters"}
              >
                <Thead>
                  <Tr>
                    <Th>{t("common.key")}</Th>
                    <Th>{t("common.type")}</Th>
                    <Th>{t("common.value")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {processor.filters?.map(
                    (filter): JSX.Element => (
                      <Tr key={filter.key}>
                        <Td>{filter.key}</Td>
                        <Td>{t(`processor.${filter.type}`)}</Td>
                        <Td>{filter.value}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </TableComposable>
            ) : (
              <TextContent>
                <Text component={TextVariants.p}>
                  {t("processor.noFilters")}
                </Text>
              </TextContent>
            )}
          </StackItem>
        </Stack>
      </PageSection>
      {processor.type === "sink" && (
        <>
          <PageSection variant={PageSectionVariants.light}>
            <Stack hasGutter={true}>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.h2}>
                    {t("processor.transformation")}
                  </Text>
                </TextContent>
              </StackItem>
              {processor.transformationTemplate ? (
                <>
                  <StackItem>
                    <TextContent>
                      <Text component={TextVariants.p}>
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
                    <Text component={TextVariants.p}>
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
                  <Text component={TextVariants.h2}>
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
                      {t(`processor.actions.${processor.action.type}`)}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  {Object.keys(processor.action.parameters).map(
                    (key): JSX.Element => (
                      <DescriptionListGroup key={key}>
                        <DescriptionListTerm>
                          {t(`processor.${key}`)}
                        </DescriptionListTerm>
                        <DescriptionListDescription>
                          {processor.action.parameters[key]}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    )
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
