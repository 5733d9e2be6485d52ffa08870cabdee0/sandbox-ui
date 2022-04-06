import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Label,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { InstanceRouteParams } from "@app/Processor/CreateProcessorPage/CreateProcessorPage";
import ProcessorDetail from "@app/Processor/ProcessorDetail/ProcessorDetail";
import { CaretDownIcon, CheckCircleIcon } from "@patternfly/react-icons";
import { Processor } from "@app/Processor/types";

const ProcessorDetailPage = () => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsToggle = (isOpen: boolean) => {
    setIsActionsOpen(isOpen);
  };
  const actionsSelect = () => {
    setIsActionsOpen(!isActionsOpen);
  };
  const actionItems = [
    <DropdownItem
      key="delete"
      component="button"
      onClick={() => console.log("delete")}
    >
      {t("common.delete")}
    </DropdownItem>,
  ];

  const processor: Processor = {
    name: "My processor",
    status: "ready",
    type: "sink",
    filters: [
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
    ],
    transformationTemplate: "Hello, there's a new message: {data.message}",
    action: {
      type: "Slack",
      parameters: {
        channel: "Demo Channel",
        webhookUrl:
          "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      },
    },
  };

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        hasShadowBottom={true}
        type="breadcrumb"
      >
        <Breadcrumb>
          <BreadcrumbItem
            render={({ className }) => (
              <Link to={`/`} className={className}>
                {t("instance.smartEventInstances")}
              </Link>
            )}
          />
          <BreadcrumbItem
            render={({ className }) => (
              <Link to={`/instance/${instanceId}`} className={className}>
                My instance
              </Link>
            )}
          />
          <BreadcrumbItem isActive>My processor</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} hasShadowBottom={true}>
        <Split hasGutter={true}>
          <SplitItem isFilled={true}>
            <Stack hasGutter={true}>
              <StackItem>
                <TextContent>
                  <Text component="h1">My processor</Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <Label color="green" icon={<CheckCircleIcon />}>
                  Ready
                </Label>
              </StackItem>
            </Stack>
          </SplitItem>
          <SplitItem>
            <Dropdown
              onSelect={actionsSelect}
              toggle={
                <DropdownToggle
                  id="toggle-id"
                  onToggle={actionsToggle}
                  toggleIndicator={CaretDownIcon}
                >
                  {t("common.actions")}
                </DropdownToggle>
              }
              isOpen={isActionsOpen}
              dropdownItems={actionItems}
            />
          </SplitItem>
        </Split>
      </PageSection>
      <ProcessorDetail processor={processor} />
    </>
  );
};

export default ProcessorDetailPage;
