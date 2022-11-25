import React from "react";
import {
  Alert,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
import { ProcessorResponse } from "@rhoas/smart-events-management-sdk";

interface ProcessorDetailProps {
  /** The processor to display */
  processor: ProcessorResponse;
}

const ProcessorDetail = (props: ProcessorDetailProps): JSX.Element => {
  const { processor } = props;
  console.log(processor);

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Alert variant="default" isInline title="TBD" />
    </PageSection>
  );
};

export default ProcessorDetail;
