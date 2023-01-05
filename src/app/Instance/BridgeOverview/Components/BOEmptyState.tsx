import React from "react";
import {
  Button,
  ButtonProps,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  Title,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

export interface BOEmptyStateProps {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
  variant: ButtonProps["variant"];
}

export const BOEmptyState = ({
  title,
  description,
  buttonLabel,
  onButtonClick,
  variant,
}: BOEmptyStateProps): JSX.Element => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{description}</EmptyStateBody>
      <EmptyStatePrimary>
        <Button variant={variant} onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      </EmptyStatePrimary>
    </EmptyState>
  );
};
