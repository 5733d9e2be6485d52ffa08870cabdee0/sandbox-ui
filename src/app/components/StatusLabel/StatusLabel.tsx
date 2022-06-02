import React from "react";
import { CheckCircleIcon } from "@patternfly/react-icons";
import { Label } from "@patternfly/react-core";

// TODO: temporary label for demo purposes. Replace it with component from shared
//  library. See https://issues.redhat.com/browse/MGDOBR-523

interface StatusLabelProps {
  status: string;
}

const StatusLabel = (props: StatusLabelProps): JSX.Element => {
  const { status } = props;

  return (
    <Label
      color={status === "ready" ? "green" : "grey"}
      icon={status === "ready" ? <CheckCircleIcon /> : null}
      style={{ textTransform: "capitalize" }}
      variant="outline"
      data-ouia-component-id={status}
      data-ouia-component-type="QE/ProcessorState"
    >
      {status}
    </Label>
  );
};

export default StatusLabel;
