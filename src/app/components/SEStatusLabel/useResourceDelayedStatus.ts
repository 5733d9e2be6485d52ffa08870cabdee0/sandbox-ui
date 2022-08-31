import {
  ResourceStatus,
  ResourceStatusDelayed,
} from "@app/components/ResourceStatusLabel/types";
import { useCallback, useEffect, useState } from "react";
import { differenceInMinutes } from "date-fns";
import { usePolling } from "../../../hooks/usePolling/usePolling";

export function useResourceDelayedStatus(
  status: ResourceStatus,
  requestedAt: Date,
  singleDelayedCheck: boolean
): ResourceStatusDelayed | undefined {
  const warningAfterMinutes = 5;
  const errorAfterMinutes = 10;
  const [alert, setAlert] = useState<ResourceStatusDelayed>();

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

  const clearPolling = usePolling(
    checkCreatedAt,
    singleDelayedCheck ? 0 : 1000
  );

  useEffect(() => {
    if (status !== ResourceStatus.CREATING && clearPolling) {
      clearPolling();
    }
  }, [clearPolling, status]);

  return alert;
}
