import React, { VoidFunctionComponent } from "react";
import {
  Bullseye,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Spinner,
} from "@patternfly/react-core";

const ProcessorEditLoading: VoidFunctionComponent = () => {
  return (
    <PageSection variant={PageSectionVariants.light} isFilled={true}>
      <Flex
        direction={{ default: "column" }}
        spaceItems={{ default: "spaceItemsXl" }}
        className="pf-u-h-100"
      >
        <FlexItem flex={{ default: "flex_1" }}>
          <Bullseye>
            <Spinner size="xl" aria-label="Loading" />
          </Bullseye>
        </FlexItem>
      </Flex>
    </PageSection>
  );
};

export default ProcessorEditLoading;
