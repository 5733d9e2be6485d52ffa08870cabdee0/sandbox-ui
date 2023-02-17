import DeleteProcessor from "@app/Processor/DeleteProcessor/DeleteProcessor";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import React, { useCallback, useEffect, useState } from "react";
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
  const [deleteProcessorId, setDeleteProcessorId] = useState("");
  const [deleteProcessorName, setDeleteProcessorName] = useState("");
  const [showProcessorDeleteModal, setShowProcessorDeleteModal] =
    useState(false);
  const history = useHistory();

  const deleteProcessor = (
    processorId: string,
    processorName: string
  ): void => {
    setDeleteProcessorId(processorId);
    setDeleteProcessorName(processorName);
    setShowProcessorDeleteModal(true);
  };

  const {
    getProcessors,
    processorListResponse,
    error: processorsError,
  } = useGetProcessorsApi();

  const triggerGetProcessors = useCallback(
    (): void => getProcessors(instanceId, null, 1, 10, undefined, true),
    [getProcessors, instanceId]
  );

  const handleOnDeleteProcessorSuccess = useCallback((): void => {
    setShowProcessorDeleteModal(false);
    getProcessors(instanceId, null, 1, 10, undefined, false);
  }, [getProcessors, instanceId]);

  usePolling(() => triggerGetProcessors(), 10000);

  useEffect(() => {
    triggerGetProcessors();
  }, [triggerGetProcessors]);

  const onCreateProcessor = (): void => {
    if (bridgeStatus === ManagedResourceStatus.Ready) {
      history.push(`/instance/${instanceId}/create-processor`);
    }
  };

  const onEditProcessor = (processorId: string): void => {
    history.push(`/instance/${instanceId}/processor/${processorId}`);
  };

  return (
    <>
      <BridgeOverview
        instanceId={instanceId}
        processorList={processorListResponse?.items}
        processorsError={processorsError}
        bridgeStatus={bridgeStatus}
        bridgeIngressEndpoint={bridgeIngressEndpoint}
        onCreateProcessor={onCreateProcessor}
        deleteProcessor={deleteProcessor}
        onEditProcessor={onEditProcessor}
      />
      <DeleteProcessor
        bridgeId={instanceId}
        processorId={deleteProcessorId}
        processorName={deleteProcessorName}
        showDeleteModal={showProcessorDeleteModal}
        onCanceled={(): void => setShowProcessorDeleteModal(false)}
        onDeleted={handleOnDeleteProcessorSuccess}
      />
    </>
  );
};
