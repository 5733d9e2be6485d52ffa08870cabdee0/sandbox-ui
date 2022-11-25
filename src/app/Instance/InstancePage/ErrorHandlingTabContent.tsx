import React from "react";
import {
  Alert,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";

export const ErrorHandlingTabContent = (): JSX.Element => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Alert variant="default" isInline title="TBD" />
    </PageSection>
  );
};
