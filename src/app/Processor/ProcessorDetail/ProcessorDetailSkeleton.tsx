import React from "react";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

const ProcessorDetailSkeleton = (): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter={true}>
          <StackItem>
            <Skeleton
              width="150px"
              screenreaderText={t("processor.loadingProcessorType")}
            />
          </StackItem>
          <StackItem>
            <Skeleton width="80px" />
          </StackItem>
        </Stack>
      </PageSection>
      <DescriptionListSkeleton />
      <DescriptionListSkeleton isLarge={true} />
      <DescriptionListSkeleton isLarge={true} />
    </>
  );
};

export default ProcessorDetailSkeleton;

type DescriptionListSkeletonProps = {
  isLarge?: boolean;
};

const DescriptionListSkeleton = ({
  isLarge = false,
}: DescriptionListSkeletonProps): JSX.Element => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Stack hasGutter={true}>
        <StackItem>
          <Skeleton fontSize="xl" width="100px" />
        </StackItem>
        <StackItem>
          <DescriptionList>
            <DescriptionListGroup key="action-type">
              <DescriptionListTerm>
                <Skeleton fontSize="md" width="80px" />
              </DescriptionListTerm>
              <DescriptionListDescription>
                <Skeleton fontSize="md" width={isLarge ? "600px" : "160px"} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </StackItem>
      </Stack>
    </PageSection>
  );
};
