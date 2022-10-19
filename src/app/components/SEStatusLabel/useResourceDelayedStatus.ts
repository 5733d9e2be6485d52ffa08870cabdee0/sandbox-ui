import {
  ResourceStatus,
  ResourceStatusDelayed,
} from "@app/components/ResourceStatusLabel/types";
import { useCallback, useEffect, useState } from "react";
import { differenceInMinutes } from "date-fns";
import { usePolling } from "../../../hooks/usePolling/usePolling";

export function useResourceDelayedStatus(
  status: ResourceStatus,
  requestedAt: Date
): ResourceStatusDelayed | undefined {
  const warningAfterMinutes = 5;
  const errorAfterMinutes = 10;
  const [alert, setAlert] = useState<ResourceStatusDelayed>();
  const [pollingInterval, setPollingInterval] = useState(1000);

  const checkCreatedAt = useCallback(() => {
    if (status === ResourceStatus.CREATING) {
      const elapsed = differenceInMinutes(new Date(), requestedAt);
      if (elapsed >= errorAfterMinutes) {
        setAlert(ResourceStatusDelayed.ERROR);
      } else if (elapsed >= warningAfterMinutes) {
        setAlert(ResourceStatusDelayed.WARNING);
      }
    }
  }, [requestedAt, errorAfterMinutes, warningAfterMinutes, status]);

  useEffect(() => {
    checkCreatedAt();
  }, [checkCreatedAt]);

  usePolling(checkCreatedAt, pollingInterval);

  useEffect(() => {
    if (status === ResourceStatus.READY || status === ResourceStatus.FAILED) {
      setPollingInterval(0);
    }
  }, [status]);

  return alert;
}
