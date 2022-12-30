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

interface BOEmptyStateProps {
  title: string;
  description: string;
  buttonLabel: string;
  changeState?: () => void | undefined;
  variant: ButtonProps["variant"];
}

export const BOEmptyState = ({
  title,
  description,
  buttonLabel,
  changeState,
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
        <Button variant={variant} onClick={changeState}>
          {buttonLabel}
        </Button>
      </EmptyStatePrimary>
    </EmptyState>
  );
};
