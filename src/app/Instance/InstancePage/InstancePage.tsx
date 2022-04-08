import React from "react";
import {
  Button,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { Link, useLocation } from "react-router-dom";

const InstancePage = () => {
  const location = useLocation();
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Instance detail</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <TextContent>
          <Text component="p">
            Placeholder content for the instance detail page.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Link to={`${location.pathname}/create-processor`}>
          <Button variant="primary">Create Processor</Button>
        </Link>
      </PageSection>
      <PageSection>
        <Link
          to={`${location.pathname}/processor/90452443-86cb-42f7-9781-d7a987ba6a3b`}
        >
          <Button variant="link">View processor</Button>
        </Link>
      </PageSection>
    </>
  );
};

export default InstancePage;
