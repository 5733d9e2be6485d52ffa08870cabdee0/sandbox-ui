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
import ProcessorEdit from "@app/Processor/ProcessorEdit/ProcessorEdit";

const CreateProcessorPage = () => {
  const { instanceId } = useParams<InstanceRouteParams>();
  const history = useHistory();
  const goToInstance = () => history.push(`/instance/${instanceId}`);

  return (
    <>
      <PageSection variant={PageSectionVariants.light} hasShadowBottom={true}>
        <Stack hasGutter={true}>
          <StackItem>
            <Breadcrumb>
              <BreadcrumbItem
                render={({ className }) => (
                  <Link to={`/`} className={className}>
                    Smart Events Instances
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
              <BreadcrumbItem isActive>Create processor</BreadcrumbItem>
            </Breadcrumb>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component="h1">Create processor</Text>
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
