import {
  Button,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import React from "react";
interface OBEmptyStateProps {
  title: string;
  description: string;
  buttonName: string;
  changeState?: () => void | undefined;
  variant:
    | "link"
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "warning"
    | "plain"
    | "control"
    | undefined;
}

export const OBEmptyState = ({
  title,
  description,
  buttonName,
  changeState,
  variant,
}: OBEmptyStateProps): JSX.Element => {
  return (
    <>
      <CardBody>
        <EmptyState variant="small">
          <EmptyStateIcon icon={PlusCircleIcon} />
          <Title headingLevel="h2" size="lg">
            {title}
          </Title>
        </EmptyState>
        <TextContent style={{ textAlign: "center" }}>
          <Text component="p"> {description}</Text>
        </TextContent>
      </CardBody>
      <CardBody style={{ textAlign: "center" }}>
        <Button variant={variant} onClick={changeState}>
          {buttonName}
        </Button>
      </CardBody>
    </>
  );
};
