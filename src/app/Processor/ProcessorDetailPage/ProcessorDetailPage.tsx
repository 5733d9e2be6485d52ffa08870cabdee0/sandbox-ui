import React from "react";
import { Link, useParams } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { InstanceRouteParams } from "@app/Processor/CreateProcessorPage/CreateProcessorPage";
import ProcessorDetail from "@app/Processor/ProcessorDetail/ProcessorDetail";

const ProcessorDetailPage = () => {
  const { instanceId } = useParams<InstanceRouteParams>();

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
              <BreadcrumbItem isActive>My processor</BreadcrumbItem>
            </Breadcrumb>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component="h1">My processor</Text>
            </TextContent>
          </StackItem>
        </Stack>
      </PageSection>
      <ProcessorDetail />
    </>
  );
};

export default ProcessorDetailPage;
