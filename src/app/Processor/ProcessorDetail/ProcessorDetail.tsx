import React from "react";
import {
  CodeBlock,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
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

const ProcessorDetail = () => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const transformationTemplate =
    "{\n" +
    '  "version": "0",\n' +
    '  "id": "7bf73129-1428-4cd3-a780-95db273d1602",\n' +
    '  "detail-type": "EC2 Instance State-change Notification",\n' +
    '  "source": "aws.ec2",\n' +
    '  "account": "123456789012",\n' +
    '  "time": "2015-11-11T21:29:54Z",\n' +
    '  "region": "us-east-1",\n' +
    '  "resources": [\n' +
    '    "arn:aws:ec2:us-east-1:123456789012:instance/i-abcd1111"\n' +
    "  ],\n" +
    '  "detail": {\n' +
    '    "instance-id": "i-0123456789",\n' +
    '    "state": "RUNNING"\n' +
    "  }\n" +
    "}";

  const filters = [
    {
      key: "source",
      type: "stringEquals",
      value: "aws.ec2",
    },
    {
      key: "detail-type",
      type: "stringEquals",
      value: "EC2 Instance State-change Notification",
    },
  ];

  return (
    <>
      <PageSection variant={PageSectionVariants.light} isWidthLimited={true}>
        <Stack hasGutter={true}>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h2}>{t("processor.filters")}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TableComposable
              variant={"compact"}
              borders={false}
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
                {filters.map((filter) => (
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
      <PageSection variant={PageSectionVariants.light} isWidthLimited={true}>
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
                {transformationTemplate}
              </CodeBlockCode>
            </CodeBlock>
          </StackItem>
        </Stack>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isWidthLimited={true}>
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
                  {t("processor.sendToSlack")}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  {t("processor.slackChannel")}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  Demo Channel
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  {t("processor.slackWebhookUrl")}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  http://demourl.com
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export default ProcessorDetail;
