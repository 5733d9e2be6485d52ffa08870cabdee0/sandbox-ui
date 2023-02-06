import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();
  const {
    getProcessors,
    processorListResponse,
    error: processorsError,
  } = useGetProcessorsApi();

  const triggerGetProcessors = useCallback(
    (): void => getProcessors(instanceId, null, 1, 10, undefined, true),
    [getProcessors, instanceId]
  );

  usePolling(() => triggerGetProcessors(), 10000);

  useEffect(() => {
    getProcessors(instanceId, null, 1, 10, undefined, true);
  }, [getProcessors, instanceId]);

  const onCreateProcessor = (): void => {
    if (bridgeStatus === ManagedResourceStatus.Ready) {
      history.push(`/instance/${instanceId}/create-processor`);
    }
  };

  return (
    <BridgeOverview
      instanceId={instanceId}
      processorList={processorListResponse?.items}
      processorsError={processorsError}
      bridgeStatus={bridgeStatus}
      bridgeIngressEndpoint={bridgeIngressEndpoint}
      onCreateProcessor={onCreateProcessor}
    />
  );
};
