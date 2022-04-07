import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProcessorEdit from "@app/Processor/ProcessorEdit/ProcessorEdit";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";

const CreateProcessorPage = () => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const history = useHistory();
  const goToInstance = () => history.push(`/instance/${instanceId}`);
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light} hasShadowBottom={true}>
        <Stack hasGutter={true}>
          <StackItem>
            <Breadcrumb
              path={[
                { label: t("instance.smartEventInstances"), linkTo: "/" },
                { label: "My instance", linkTo: `/instance/${instanceId}` },
                { label: t("processor.createProcessor") },
              ]}
            />
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component="h1">{t("processor.createProcessor")}</Text>
            </TextContent>
          </StackItem>
        </Stack>
      </PageSection>
      <ProcessorEdit onSave={goToInstance} onCancel={goToInstance} />
    </>
  );
};

type InstanceRouteParams = {
  instanceId: string;
};

export default CreateProcessorPage;
