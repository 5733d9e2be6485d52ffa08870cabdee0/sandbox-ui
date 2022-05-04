import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Skeleton,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";

interface PageHeaderSkeletonProps {
  pageTitle: string;
  hasActionDropdown: boolean;
  hasLabel: boolean;
}

const PageHeaderSkeleton = (props: PageHeaderSkeletonProps): JSX.Element => {
  const { pageTitle, hasActionDropdown, hasLabel } = props;
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        hasShadowBottom={true}
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
      <PageSection variant={PageSectionVariants.light} hasShadowBottom={true}>
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
    </>
  );
};

export default PageHeaderSkeleton;
