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
  hasEditButton?: boolean;
  hasActionDropdown: boolean;
  hasLabel: boolean;
  noShadowBottom?: boolean;
}

const PageHeaderSkeleton = (props: PageHeaderSkeletonProps): JSX.Element => {
  const {
    pageTitle,
    hasEditButton = false,
    hasActionDropdown,
    hasLabel,
    noShadowBottom = false,
  } = props;
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        hasShadowBottom={!noShadowBottom}
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
        hasShadowBottom={!noShadowBottom}
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
          {hasEditButton && (
            <SplitItem>
              <Skeleton fontSize="2xl" width={"60px"} />
            </SplitItem>
          )}
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
