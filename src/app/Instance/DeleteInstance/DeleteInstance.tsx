import React, { useEffect, useState } from "react";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { DeleteModal } from "@app/components/DeleteModal/DeleteModal";
import { useDeleteBridgeApi } from "../../../hooks/useBridgesApi/useDeleteBridgeApi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ResponseError } from "../../../types/Error";

interface DeleteInstanceProps {
  /** Flag to show/close the modal */
  showDeleteModal: boolean;
  /** The id of the instance to delete */
  instanceId?: string;
  /** The name of the instance to delete */
  instanceName?: string;
  /** Callback executed when the deletion is confirmed */
  onDeleted: () => void;
  /** Callback executed when the deletion is canceled */
  onCanceled: () => void;
}

const DeleteInstance = (props: DeleteInstanceProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const { showDeleteModal, instanceId, instanceName, onDeleted, onCanceled } =
    props;
  const [preloading, setPreloading] = useState(false);
  const [deleteBlockedReason, setDeleteBlockedReason] = useState<
    string | undefined
  >();

  const { getProcessors, processorListResponse } = useGetProcessorsApi();

  useEffect(() => {
    if (showDeleteModal && instanceId && instanceName) {
      setPreloading(true);
      getProcessors(instanceId);
    }
  }, [showDeleteModal, instanceId, instanceName, getProcessors]);

  useEffect(() => {
    if (processorListResponse) {
      setPreloading(false);
      if (processorListResponse.total && processorListResponse.total > 0) {
        setDeleteBlockedReason(
          t("instance.errors.cantDeleteBecauseProcessorsInside")
        );
      }
    }
  }, [processorListResponse, t]);

  const {
    deleteBridge,
    isLoading: deleteBridgeLoading,
    success: bridgeDeleteSuccess,
    error: bridgeDeleteError,
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
    if (bridgeDeleteError) {
      // Doing the following check because it could pass some time between
      // the check on existing processors and when the user actually
      // confirms the deletion. If in the meantime someone creates a processor,
      // the API error will trigger the error message inside the modal.
      if (
        axios.isAxiosError(bridgeDeleteError) &&
        (bridgeDeleteError.response?.data as ResponseError).code ===
          "OPENBRIDGE-2"
      ) {
        setDeleteBlockedReason(
          t("instance.errors.cantDeleteBecauseProcessorsInside")
        );
      }
    }
  }, [bridgeDeleteSuccess, bridgeDeleteError, onDeleted, t]);

  return (
    <>
      {instanceId && instanceName && (
        <DeleteModal
          ouiaId="delete-instance"
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
