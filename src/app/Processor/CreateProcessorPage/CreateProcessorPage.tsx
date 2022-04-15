import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProcessorEdit from "@app/Processor/ProcessorEdit/ProcessorEdit";
import { Breadcrumb } from "@app/components/Breadcrumb/Breadcrumb";

const CreateProcessorPage = (): JSX.Element => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const history = useHistory();
  const goToInstance = (): void => history.push(`/instance/${instanceId}`);
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <>
      <PageSection type="breadcrumb">
        <Breadcrumb
          path={[
            { label: t("instance.smartEventInstances"), linkTo: "/" },
            { label: "Instance one", linkTo: `/instance/${instanceId}` },
            { label: t("processor.createProcessor") },
          ]}
        />
      </PageSection>
      <PageSection variant={PageSectionVariants.light} hasShadowBottom={true}>
        <TextContent>
          <Text component="h1">{t("processor.createProcessor")}</Text>
        </TextContent>
      </PageSection>
      <ProcessorEdit onSave={goToInstance} onCancel={goToInstance} />
    </>
  );
};

type InstanceRouteParams = {
  instanceId: string;
};

export default CreateProcessorPage;
