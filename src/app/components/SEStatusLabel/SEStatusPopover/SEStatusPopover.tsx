import React, { RefObject, useState, VoidFunctionComponent } from "react";
import { Popover } from "@patternfly/react-core";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { ResourceStatusDelayed } from "@app/components/ResourceStatusLabel/types";
import SEStatusPopoverContent from "@app/components/SEStatusLabel/SEStatusPopover/SEStatusPopoverContent";

interface SEStatusPopoverProps {
  initialOpen?: boolean;
  title: string;
  status: ManagedResourceStatus;
  creationDelayed?: ResourceStatusDelayed;
  reference?: RefObject<HTMLButtonElement>;
}

const SEStatusPopover: VoidFunctionComponent<SEStatusPopoverProps> = (
  props
) => {
  const {
    initialOpen = false,
    title,
    status,
    creationDelayed,
    reference,
  } = props;
  const [isVisible, setIsVisible] = useState(initialOpen);

  return (
    <Popover
      headerContent={title}
      bodyContent={
        <SEStatusPopoverContent
          status={status}
          creationDelayed={creationDelayed}
        />
      }
      isVisible={isVisible}
      shouldOpen={(): void => setIsVisible(true)}
      shouldClose={(): void => setIsVisible(false)}
      position={"right"}
      enableFlip={true}
      reference={reference}
    />
  );
};

export default SEStatusPopover;
