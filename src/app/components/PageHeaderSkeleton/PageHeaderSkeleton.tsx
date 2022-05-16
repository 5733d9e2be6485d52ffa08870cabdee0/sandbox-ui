import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Skeleton,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Tab,
  Tabs,
} from "@patternfly/react-core";

interface PageHeaderSkeletonProps {
  pageTitle: string;
  hasActionDropdown: boolean;
  hasLabel: boolean;
  totalTabs?: number;
}

const PageHeaderSkeleton = (props: PageHeaderSkeletonProps): JSX.Element => {
  const { pageTitle, hasActionDropdown, hasLabel, totalTabs = 0 } = props;
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        hasShadowBottom={totalTabs === 0}
        type="breadcrumb"
      >
        <Split hasGutter={true}>
          <SplitItem>
            <Skeleton fontSize="sm" width={"140px"} />
          </SplitItem>
          <SplitItem>
            <Skeleton fontSize="sm" width={"140px"} />
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        hasShadowBottom={totalTabs === 0}
      >
        <Split hasGutter={true}>
          <SplitItem isFilled={true}>
            <Stack hasGutter={true}>
              <StackItem>
                <Skeleton
                  fontSize="2xl"
                  width={"20%"}
                  screenreaderText={pageTitle}
                />
              </StackItem>
              {hasLabel && (
                <StackItem>
                  <Skeleton fontSize="md" width={"80px"} />
                </StackItem>
              )}
            </Stack>
          </SplitItem>
          {hasActionDropdown && (
            <SplitItem>
              <Skeleton fontSize="2xl" width={"100px"} />
            </SplitItem>
          )}
        </Split>
      </PageSection>
      {totalTabs > 0 && (
        <PageSection variant={PageSectionVariants.light} type="tabs">
          <Tabs usePageInsets>
            {[...Array(totalTabs).keys()].map((tabNumber) => (
              <Tab
                key={tabNumber}
                eventKey={tabNumber}
                title={<Skeleton fontSize="xl" width={"100px"} />}
              />
            ))}
          </Tabs>
        </PageSection>
      )}
    </>
  );
};

export default PageHeaderSkeleton;
