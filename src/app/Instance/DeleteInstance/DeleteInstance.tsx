import React, { useEffect, useRef, useState } from "react";
import { useGetProcessorsApi } from "../../../hooks/useProcessorsApi/useGetProcessorsApi";
import { DeleteModal } from "@app/components/DeleteModal/DeleteModal";
import { useDeleteBridgeApi } from "../../../hooks/useBridgesApi/useDeleteBridgeApi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  getErrorCode,
  getErrorReason,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
  const { showDeleteModal, instanceId, instanceName, onDeleted, onCanceled } =
    props;
  const [preloading, setPreloading] = useState(false);
  const [deleteBlockedReason, setDeleteBlockedReason] = useState<
    string | undefined
  >();
  const shouldRedirectToHome = useRef<boolean>(false);

  const {
    getProcessors,
    processorListResponse,
    error: processorListError,
  } = useGetProcessorsApi();

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
          t("instance.errors.cantDeleteBecauseProcessorsInside", {
            resource: instanceName,
          })
        );
      }
    }
    if (processorListError && axios.isAxiosError(processorListError)) {
      setPreloading(false);
      setDeleteBlockedReason(t("instance.errors.cantDeleteTryLater"));
    }
  }, [instanceName, processorListError, processorListResponse, t]);

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
    if (deleteBlockedReason && shouldRedirectToHome.current) {
      history.replace("/");
    }
    shouldRedirectToHome.current = false;
    setDeleteBlockedReason(undefined);
    onCanceled();
  };

  useEffect(() => {
    if (bridgeDeleteSuccess) {
      onDeleted();
    }
    if (bridgeDeleteError && axios.isAxiosError(bridgeDeleteError)) {
      // Doing the following check because it could pass some time between
      // the check on existing processors and when the user actually
      // confirms the deletion. If in the meantime someone creates a processor,
      // the API error will trigger the error message inside the modal.
      const genericErrorMsg = t("instance.errors.cantDeleteTryLater");
      if (
        isServiceApiError(bridgeDeleteError) &&
        getErrorCode(bridgeDeleteError) === APIErrorCodes.ERROR_2
      ) {
        setDeleteBlockedReason(
          getErrorReason(bridgeDeleteError) ?? genericErrorMsg
        );
        shouldRedirectToHome.current = true;
      } else if (
        isServiceApiError(bridgeDeleteError) &&
        getErrorCode(bridgeDeleteError) === APIErrorCodes.ERROR_4
      ) {
        setDeleteBlockedReason(
          t("instance.errors.cantDeleteBecauseNotExisting")
        );
        shouldRedirectToHome.current = true;
      } else {
        setDeleteBlockedReason(genericErrorMsg);
      }
    }
  }, [bridgeDeleteSuccess, bridgeDeleteError, onDeleted, t]);

  return (
    <>
      {instanceId && instanceName && (
        <DeleteModal
          ouiaId="delete-instance"
          modalTitle={
            deleteBlockedReason
              ? t("instance.errors.cantDelete")
              : t("instance.deleteIt")
          }
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
