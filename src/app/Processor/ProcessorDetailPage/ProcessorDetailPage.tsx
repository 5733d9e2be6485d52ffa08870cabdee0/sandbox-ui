import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
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
import ProcessorDetail from "@app/Processor/ProcessorDetail/ProcessorDetail";
import { CaretDownIcon, CheckCircleIcon } from "@patternfly/react-icons";
import { Processor } from "../../../types/Processor";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";

const ProcessorDetailPage = () => {
  const { instanceId } = useParams<ProcessorRouteParams>();
  const history = useHistory();
  const goToInstance = () => history.push(`/instance/${instanceId}`);
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
      onClick={() => goToInstance()}
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
        <Breadcrumb
          path={[
            { label: t("instance.smartEventInstances"), linkTo: "/" },
            { label: "My instance", linkTo: `/instance/${instanceId}` },
            { label: "My processor" },
          ]}
        />
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
                {/* @TODO: replace this temp label with component from shared library */}
                {/* see https://issues.redhat.com/browse/MGDOBR-523 */}
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

type ProcessorRouteParams = {
  instanceId: string;
  processorId: string;
};
