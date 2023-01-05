import React from "react";
import {
  EmptyState as EmptyStatePF,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { Trans, useTranslation } from "@rhoas/app-services-ui-components";

export interface EmptyStateNoResultsProps {
  bodyMsgI18nKey: string;
  onClearAllFilters: () => void;
  title: string;
}

export const EmptyStateNoResults = ({
  bodyMsgI18nKey,
  onClearAllFilters,
  title,
}: EmptyStateNoResultsProps): JSX.Element => {
  const { t } = useTranslation("smartEventsTempDictionary");

  return (
    <EmptyStatePF variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      <EmptyStateBody>
        <Trans
          t={t}
          i18nKey={bodyMsgI18nKey}
          components={[
            <a key="on-clear-filters" onClick={onClearAllFilters} />,
          ]}
        />
      </EmptyStateBody>
    </EmptyStatePF>
  );
};
