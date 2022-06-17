import React, { FunctionComponent, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  AppServicesEmptyState,
  EmptyStateVariant,
} from "@rhoas/app-services-ui-components";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { ErrorWithDetail } from "../../../types/Error";

export const ErrorWithDetailBoundary: FunctionComponent = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  return (
    <ErrorBoundary
      fallbackRender={({ error }: { error: ErrorWithDetail }): JSX.Element => {
        const detailSection = error.detailSection ?? (
          <TextContent>
            <Text component="h1">{t("common.genericError")}</Text>
          </TextContent>
        );

        const errorMessage = error.detailSection
          ? `${error.message} ${t("common.tryAgainLater")}`
          : `${t("common.tryAgainLater")}`;

        return (
          <>
            <PageSection variant={PageSectionVariants.light}>
              {detailSection}
            </PageSection>
            <PageSection>
              <AppServicesEmptyState
                emptyStateBodyProps={{
                  body: errorMessage,
                }}
                emptyStateProps={{
                  variant: EmptyStateVariant.UnexpectedError,
                }}
                titleProps={{
                  headingLevel: "h1",
                  title: t("common.unexpectedError"),
                }}
              />
            </PageSection>
          </>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
