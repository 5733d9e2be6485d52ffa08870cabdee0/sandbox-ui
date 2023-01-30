import React, { useCallback, useEffect } from "react";
import { usePolling } from "src/hooks/usePolling/usePolling";
import { useGetProcessorsApi } from "src/hooks/useProcessorsApi/useGetProcessorsApi";
import { BridgeOverview } from "../BridgeOverview/BridgeOverview";

interface BridgeOverviewTabContentProps {
  instanceId: string;
  bridgeStatus: string | undefined;
  bridgeIngressEndpoint: string | undefined;
}

export const BridgeOverviewTabContent = ({
  instanceId,
  bridgeStatus,
  bridgeIngressEndpoint,
}: BridgeOverviewTabContentProps): JSX.Element => {
  const {
    getProcessors,
    processorListResponse,
    error: processorsError,
  } = useGetProcessorsApi();

  const triggerGetProcessors = useCallback(
    (): void =>
      getProcessors(instanceId, null, undefined, undefined, undefined, true),
    [getProcessors, instanceId]
  );

  usePolling(() => triggerGetProcessors(), 10000);

  useEffect(() => {
    getProcessors(instanceId, null, undefined, undefined, undefined, true);
  }, [getProcessors, instanceId]);

  return (
    <BridgeOverview
      instanceId={instanceId}
      processorList={processorListResponse?.items}
      processorsError={processorsError}
      bridgeStatus={bridgeStatus}
      bridgeIngressEndpoint={bridgeIngressEndpoint}
    />
  );
};
