import React from "react";
import { useLocation } from "react-router-dom";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { NotFoundIcon } from "@app/components/NotFoundIcon/NotFoundIcon";

export interface PageNotFoundStateParams {
  title?: string;
  message?: string;
}

export const PageNotFound = (): JSX.Element => {
  const location = useLocation<PageNotFoundStateParams>();
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <EmptyState>
      <EmptyStateIcon icon={NotFoundIcon} />
      <Title headingLevel="h4" size="lg">
        {location.state?.title ?? t("common.pageNotFound")}
      </Title>
      <EmptyStateBody>
        {location.state?.message ?? t("common.pageDoesNotExistError")}
      </EmptyStateBody>
    </EmptyState>
  );
};
