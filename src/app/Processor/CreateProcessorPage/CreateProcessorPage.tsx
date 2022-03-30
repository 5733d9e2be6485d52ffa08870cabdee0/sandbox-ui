import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { Link, useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProcessorEdit from "@app/Processor/ProcessorEdit/ProcessorEdit";

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
              <BreadcrumbItem isActive>
                {t("processor.createProcessor")}
              </BreadcrumbItem>
            </Breadcrumb>
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
