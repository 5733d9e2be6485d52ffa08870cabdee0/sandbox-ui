import React, { useEffect, useState } from "react";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { DeleteModal } from "@app/components/DeleteModal/DeleteModal";
import { useDeleteBridgeApi } from "../../../hooks/useBridgesApi/useDeleteBridgeApi";

interface DeleteInstanceProps {
  /** Flag to show/close the modal */
  showDeleteModal: boolean;
  /** The id of the instance to delete */
  instanceId?: string;
  /** The name of the instance to delete */
  instanceName?: string;
  /** The number of processors inside the instance.
   * If not provided, it will be retrieved by this component */
  processorsCount?: number;
  /** Callback executed when the deletion is confirmed */
  onDeleted: () => void;
  /** Callback executed when the deletion is canceled */
  onCanceled: () => void;
}

const DeleteInstance = (props: DeleteInstanceProps): JSX.Element => {
  const {
    showDeleteModal,
    instanceId,
    instanceName,
    processorsCount,
    onDeleted,
    onCanceled,
  } = props;
  const [preloading, setPreloading] = useState(false);
  const [deleteBlockedReason, setDeleteBlockedReason] = useState<
    string | undefined
  >();

  const { getProcessors, processorListResponse } = useGetProcessorsApi();

  useEffect(() => {
    if (showDeleteModal && instanceId && instanceName) {
      if (processorsCount === undefined) {
        setPreloading(true);
        getProcessors(instanceId);
      } else if (processorsCount > 0) {
        setDeleteBlockedReason(
          "There are processors associated with this instance. Please delete them first."
        );
      }
    }
  }, [
    showDeleteModal,
    instanceId,
    instanceName,
    getProcessors,
    processorsCount,
  ]);

  useEffect(() => {
    if (processorListResponse) {
      setPreloading(false);
      if (processorListResponse.total && processorListResponse.total > 0) {
        setDeleteBlockedReason(
          "There are processors associated with this instance. Please delete them first."
        );
      }
    }
  }, [processorListResponse]);

  const {
    deleteBridge,
    isLoading: deleteBridgeLoading,
    success: bridgeDeleteSuccess,
  } = useDeleteBridgeApi();

  const handleDelete = (): void => {
    if (instanceId) {
      deleteBridge(instanceId);
    }
  };

  const handleCancel = (): void => {
    setDeleteBlockedReason(undefined);
    onCanceled();
  };

  useEffect(() => {
    if (bridgeDeleteSuccess) {
      onDeleted();
    }
  }, [bridgeDeleteSuccess, onDeleted]);

  return (
    <>
      {instanceId && instanceName && (
        <DeleteModal
          modalTitle={`Delete Smart Events Instance?`}
          showDialog={showDeleteModal}
          resourceType={"Instance"}
          resourceName={instanceName}
          isPreloading={preloading}
          blockedDeletionReason={deleteBlockedReason}
          isLoading={deleteBridgeLoading}
          onCancel={handleCancel}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default DeleteInstance;
