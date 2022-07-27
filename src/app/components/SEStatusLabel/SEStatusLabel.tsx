import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  VoidFunctionComponent,
} from "react";
import { ManagedResourceStatus } from "@openapi/generated";
import { ResourceStatusLabel } from "@app/components/ResourceStatusLabel/ResourceStatusLabel";
import {
  ResourceStatus,
  ResourceStatusDelayed,
} from "@app/components/ResourceStatusLabel/types";

import { useTranslation } from "react-i18next";
import { differenceInMinutes } from "date-fns";
import { usePolling } from "../../../hooks/usePolling/usePolling";
import { CreationStatusOrder } from "@app/components/SEStatusLabel/SEStatusPopover/types";
import SEStatusPopover from "@app/components/SEStatusLabel/SEStatusPopover/SEStatusPopover";

export interface SEStatusLabelProps {
  status: ManagedResourceStatus;
  resourceType: "bridge" | "processor";
  requestedAt: Date;
}

const SEStatusLabel: VoidFunctionComponent<SEStatusLabelProps> = (props) => {
  const { status, resourceType, requestedAt } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const labelRef = useRef<HTMLButtonElement>(null);
  const showPopover = CreationStatusOrder.indexOf(status) > -1;
  const [alert, setAlert] = useState<ResourceStatusDelayed>();

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

  const warningAfterMinutes = 5;
  const errorAfterMinutes = 10;

  const checkCreatedAt = useCallback(() => {
    const elapsed = differenceInMinutes(new Date(), requestedAt);
    if (elapsed >= errorAfterMinutes) {
      setAlert(ResourceStatusDelayed.ERROR);
    } else if (elapsed >= warningAfterMinutes) {
      setAlert(ResourceStatusDelayed.WARNING);
    }
  }, [requestedAt, errorAfterMinutes, warningAfterMinutes]);

  const clearPolling = usePolling(checkCreatedAt, 1000, true);

  useEffect(() => {
    if (resourceStatus !== ResourceStatus.CREATING && clearPolling) {
      clearPolling();
    }
  }, [clearPolling, resourceStatus]);

  return (
    <>
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
    </>
  );
};

export default SEStatusLabel;
