import React, { useMemo, useRef, VoidFunctionComponent } from "react";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { ResourceStatusLabel } from "@app/components/ResourceStatusLabel/ResourceStatusLabel";
import { ResourceStatus } from "@app/components/ResourceStatusLabel/types";

import { useTranslation } from "@rhoas/app-services-ui-components";
import { CreationStatusOrder } from "@app/components/SEStatusLabel/SEStatusPopover/types";
import SEStatusPopover from "@app/components/SEStatusLabel/SEStatusPopover/SEStatusPopover";
import { useResourceDelayedStatus } from "@app/components/SEStatusLabel/useResourceDelayedStatus";

export interface SEStatusLabelProps {
  /** The status of the resource */
  status: ManagedResourceStatus;
  /** The type of resource */
  resourceType: "bridge" | "processor";
  /** When the resource was requested (created or updated) */
  requestedAt: Date;
}

const SEStatusLabel: VoidFunctionComponent<SEStatusLabelProps> = (props) => {
  const { status, resourceType, requestedAt } = props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);
  const labelRef = useRef<HTMLButtonElement>(null);
  const showPopover = CreationStatusOrder.indexOf(status) > -1;

  const title =
    resourceType === "bridge"
      ? t("instance.creatingInstance")
      : t("processor.creatingProcessor");

  const resourceStatus = useMemo(() => {
    switch (status) {
      case ManagedResourceStatus.Accepted:
      case ManagedResourceStatus.Preparing:
      case ManagedResourceStatus.Provisioning:
        return ResourceStatus.CREATING;
      case ManagedResourceStatus.UpdateAccepted:
      case ManagedResourceStatus.UpdatePreparing:
      case ManagedResourceStatus.UpdateProvisioning:
        return ResourceStatus.UPDATING;
      case ManagedResourceStatus.Deprovision:
      case ManagedResourceStatus.Deleting:
      case ManagedResourceStatus.Deleted:
        return ResourceStatus.DELETING;
      case ManagedResourceStatus.Failed:
        return ResourceStatus.FAILED;
      case ManagedResourceStatus.Ready:
        return ResourceStatus.READY;
    }
  }, [status]);

  const alert = useResourceDelayedStatus(resourceStatus, requestedAt);

  return (
    <div
      data-ouia-component-id={status}
      data-ouia-component-type="QE/ResourceStatus"
    >
      {showPopover && (
        <SEStatusPopover
          title={title}
          status={status}
          reference={labelRef}
          creationDelayed={alert}
        />
      )}
      <ResourceStatusLabel
        status={resourceStatus}
        ref={labelRef}
        creationDelayed={alert}
      />
    </div>
  );
};

export default SEStatusLabel;
