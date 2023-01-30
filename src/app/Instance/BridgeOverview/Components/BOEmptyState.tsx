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
  createButton: {
    title: string;
    onCreate: () => void;
    isDisabled?: boolean;
  };
  variant: ButtonProps["variant"];
}

export const BOEmptyState = ({
  title,
  description,
  createButton,
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
        <Button
          variant={variant}
          isDisabled={createButton.isDisabled}
          onClick={createButton.onCreate}
        >
          {createButton.title}
        </Button>
      </EmptyStatePrimary>
    </EmptyState>
  );
};
