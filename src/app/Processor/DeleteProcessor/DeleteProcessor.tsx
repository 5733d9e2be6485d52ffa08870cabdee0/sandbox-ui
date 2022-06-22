import React, { useEffect, useState } from "react";
import { DeleteModal } from "@app/components/DeleteModal/DeleteModal";
import { useDeleteProcessorApi } from "../../../hooks/useProcessorsApi/useDeleteProcessorApi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { ResponseError } from "../../../types/Error";

interface DeleteProcessorProps {
  /** Flag to show/close the modal */
  showDeleteModal: boolean;
  /** The id of the bridge where the processor belongs */
  bridgeId: string;
  /** The id of the processor to delete */
  processorId?: string;
  /** The name of the processor to delete */
  processorName?: string;
  /** Callback executed when the deletion is confirmed */
  onDeleted: () => void;
  /** Callback executed when the deletion is canceled */
  onCanceled: () => void;
}

const DeleteProcessor = (props: DeleteProcessorProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const {
    showDeleteModal,
    bridgeId,
    processorId,
    processorName,
    onDeleted,
    onCanceled,
  } = props;

  const [deleteBlockedReason, setDeleteBlockedReason] = useState<
    string | undefined
  >();

  const { deleteProcessor, isLoading, error, success } =
    useDeleteProcessorApi();

  const handleDelete = (): void => {
    if (bridgeId && processorId) {
      deleteProcessor(bridgeId, processorId);
    }
  };

  const handleCancel = (): void => {
    setDeleteBlockedReason(undefined);
    onCanceled();
  };

  useEffect(() => {
    if (success) {
      onDeleted();
    }
  }, [success, onDeleted]);

  useEffect(() => {
    if (error && axios.isAxiosError(error)) {
      const genericErrorMsg = t("processor.errors.cantDeleteTryLater");
      if (
        isServiceApiError(error) &&
        getErrorCode(error) === APIErrorCodes.ERROR_2
      ) {
        setDeleteBlockedReason(
          (error.response?.data as ResponseError)?.reason ?? genericErrorMsg
        );
      } else if (
        isServiceApiError(error) &&
        getErrorCode(error) === APIErrorCodes.ERROR_4
      ) {
        setDeleteBlockedReason(
          t("processor.errors.cantDeleteBecauseNotExisting")
        );
      } else {
        setDeleteBlockedReason(genericErrorMsg);
      }
    }
  }, [error, t]);

  return (
    <>
      {processorId && processorName && (
        <DeleteModal
          ouiaId="delete-processor"
          modalTitle={t("processor.deleteProcessor")}
          showDialog={showDeleteModal}
          isPreloading={false}
          blockedDeletionReason={deleteBlockedReason}
          resourceType={t("common.processor")}
          resourceName={processorName}
          isLoading={isLoading}
          onCancel={handleCancel}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default DeleteProcessor;
