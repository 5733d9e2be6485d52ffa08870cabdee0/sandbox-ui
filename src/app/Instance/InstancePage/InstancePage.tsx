import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

const InstancePage = () => {
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
    </>
  );
};

export default InstancePage;
