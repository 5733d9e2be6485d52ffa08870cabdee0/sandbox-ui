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
import { Processor } from "@app/Processor/types";

interface ProcessorDetailProps {
  processor: Processor;
}

const ProcessorDetail = (props: ProcessorDetailProps) => {
  const { processor } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  // const transformationTemplate = "Hello, there's a new message: {data.message}";
  //
  // const filters = [
  //   {
  //     key: "source",
  //     type: "stringEquals",
  //     value: "aws.ec2",
  //   },
  //   {
  //     key: "detail-type",
  //     type: "stringEquals",
  //     value: "EC2 Instance State-change Notification",
  //   },
  // ];

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
            <Label color={"blue"}>{t(`processor.${processor.type}`)}</Label>
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
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    {t("processor.sourceType")}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {t(`processor.actions.${processor.source.type}`)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {Object.keys(processor.source.parameters).map((key) => (
                  <DescriptionListGroup>
                    <DescriptionListTerm>
                      {t(`processor.${key}`)}
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      {processor.source.parameters[key]}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
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
            <TableComposable
              variant={"compact"}
              borders={true}
              style={{ maxWidth: 800 }}
            >
              <Thead>
                <Tr>
                  <Th>{t("common.key")}</Th>
                  <Th>{t("common.type")}</Th>
                  <Th>{t("common.value")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {processor.filters?.map((filter) => (
                  <Tr key={filter.key}>
                    <Td>{filter.key}</Td>
                    <Td>{t(`processor.${filter.type}`)}</Td>
                    <Td>{filter.value}</Td>
                  </Tr>
                ))}
              </Tbody>
            </TableComposable>
          </StackItem>
        </Stack>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter={true}>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h2}>
                {t("processor.transformation")}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.p}>
                {t("processor.transformationTemplate")}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <CodeBlock style={{ maxWidth: 800 }}>
              <CodeBlockCode id="code-content">
                {processor.transformationTemplate}
              </CodeBlockCode>
            </CodeBlock>
          </StackItem>
        </Stack>
      </PageSection>
      {processor.type === "sink" && (
        <PageSection variant={PageSectionVariants.light}>
          <Stack hasGutter={true}>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h2}>{t("processor.action")}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    {t("processor.actionType")}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {t(`processor.actions.${processor.action.type}`)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {Object.keys(processor.action.parameters).map((key) => (
                  <DescriptionListGroup>
                    <DescriptionListTerm>
                      {t(`processor.${key}`)}
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      {processor.action.parameters[key]}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
              </DescriptionList>
            </StackItem>
          </Stack>
        </PageSection>
      )}
    </>
  );
};

export default ProcessorDetail;
