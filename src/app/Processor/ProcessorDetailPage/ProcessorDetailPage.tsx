import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
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
import { CaretDownIcon } from "@patternfly/react-icons";
import { Processor } from "../../../types/Processor";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";
import StatusLabel from "@app/components/StatusLabel/StatusLabel";

const ProcessorDetailPage = (): JSX.Element => {
  const { instanceId } = useParams<ProcessorRouteParams>();
  const history = useHistory();
  const goToInstance = (): void => history.push(`/instance/${instanceId}`);
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsToggle = (isOpen: boolean): void => {
    setIsActionsOpen(isOpen);
  };
  const actionsSelect = (): void => {
    setIsActionsOpen(!isActionsOpen);
  };
  const actionItems = [
    <DropdownItem
      key="delete"
      component="button"
      onClick={(): void => goToInstance()}
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
            { label: "Instance one", linkTo: `/instance/${instanceId}` },
            { label: "Processor one" },
          ]}
        />
      </PageSection>
      <PageSection variant={PageSectionVariants.light} hasShadowBottom={true}>
        <Split hasGutter={true}>
          <SplitItem isFilled={true}>
            <Stack hasGutter={true}>
              <StackItem>
                <TextContent>
                  <Text component="h1">Processor one</Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <StatusLabel status="ready" />
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
