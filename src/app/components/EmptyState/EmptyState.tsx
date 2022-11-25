import React from "react";
import {
  Button,
  EmptyState as EmptyStatePF,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { Trans } from "@rhoas/app-services-ui-components";

interface EmptyStateProps {
  createButton: {
    title: string;
    onCreate: () => void;
    isDisabled?: boolean;
  };
  quickStartGuide?: {
    i18nKey: string;
    onQuickstartGuide: () => void;
  };
  title: string;
}

export const EmptyState = ({
  createButton,
  quickStartGuide,
  title,
}: EmptyStateProps): JSX.Element => {
  return (
    <EmptyStatePF variant={EmptyStateVariant.xs}>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      {quickStartGuide && (
        <EmptyStateBody>
          <Trans
            ns={"smartEventsTempDictionary"}
            i18nKey={quickStartGuide.i18nKey}
            components={[
              <a
                key="quick-start-guide"
                onClick={quickStartGuide.onQuickstartGuide}
              />,
            ]}
          />
        </EmptyStateBody>
      )}
      <Button
        variant="primary"
        onClick={createButton.onCreate}
        isDisabled={createButton.isDisabled}
      >
        {createButton.title}
      </Button>
    </EmptyStatePF>
  );
};