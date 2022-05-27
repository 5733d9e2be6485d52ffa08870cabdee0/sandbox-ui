import React, { useEffect } from "react";
import { DeleteModal } from "@app/components/DeleteModal/DeleteModal";
import { useDeleteProcessorApi } from "../../../hooks/useProcessorsApi/useDeleteProcessorApi";
import { useTranslation } from "react-i18next";

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

  const { deleteProcessor, isLoading, error, success } =
    useDeleteProcessorApi();

  const handleDelete = (): void => {
    if (bridgeId && processorId) {
      deleteProcessor(bridgeId, processorId);
    }
  };

  const handleCancel = (): void => {
    onCanceled();
  };

  useEffect(() => {
    if (success) {
      onDeleted();
    }
  }, [success, onDeleted]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <>
      {processorId && processorName && (
        <DeleteModal
          modalTitle={t("processor.deleteProcessor")}
          showDialog={showDeleteModal}
          isPreloading={false}
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
