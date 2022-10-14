import React from "react";
import {
  Flex,
  FlexItem,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Stack,
  StackItem,
} from "@patternfly/react-core";

const ProcessorEditSkeleton = (): JSX.Element => {
  return (
    <PageSection
      variant={PageSectionVariants.light}
      padding={{ default: "noPadding" }}
    >
      <section className="processor-edit__form">
        <Flex
          direction={{ default: "column" }}
          spaceItems={{ default: "spaceItemsXl" }}
        >
          <FlexItem>
            <Skeleton fontSize="xl" width="30%" />
          </FlexItem>
          <FlexItem>
            <Stack hasGutter={true}>
              <StackItem>
                <Skeleton fontSize="sm" width="20%" />
              </StackItem>
              <StackItem>
                <Grid hasGutter={true}>
                  <GridItem span={6}>
                    <Skeleton shape="square" width="100%" height="110px" />
                  </GridItem>
                  <GridItem span={6}>
                    <Skeleton shape="square" width="100%" height="110px" />
                  </GridItem>
                </Grid>
              </StackItem>
            </Stack>
          </FlexItem>
          <FlexItem>
            <Stack hasGutter={true}>
              <StackItem>
                <Skeleton fontSize="sm" width="20%" />
              </StackItem>
              <StackItem>
                <Skeleton fontSize="xl" width="100%" />
              </StackItem>
            </Stack>
          </FlexItem>
        </Flex>
      </section>
    </PageSection>
  );
};

export default ProcessorEditSkeleton;
